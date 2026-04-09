"""
OMNIQ Auth Router — JWT Authentication (lightweight, no bcrypt/jose)
"""
import os
import hmac
import hashlib
import base64
import json
import time
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr

from app.database import db_manager

router = APIRouter()

# ── Простой JWT без jose ──────────────────────────────────────────────────────
SECRET = os.getenv("SECRET_KEY", "omniq-secret-key-2024")

def _b64(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b'=').decode()

def create_token(username: str, role: str = "admin") -> str:
    header = _b64(json.dumps({"alg":"HS256","typ":"JWT"}).encode())
    payload = _b64(json.dumps({"sub": username, "role": role, "exp": int(time.time()) + 86400}).encode())
    sig = _b64(hmac.new(SECRET.encode(), f"{header}.{payload}".encode(), hashlib.sha256).digest())
    return f"{header}.{payload}.{sig}"

def verify_token(token: str) -> dict:
    try:
        parts = token.split(".")
        if len(parts) != 3:
            raise ValueError("Invalid token")
        header, payload, sig = parts
        expected = _b64(hmac.new(SECRET.encode(), f"{header}.{payload}".encode(), hashlib.sha256).digest())
        if sig != expected:
            raise ValueError("Invalid signature")
        data = json.loads(base64.urlsafe_b64decode(payload + "=="))
        if data.get("exp", 0) < time.time():
            raise ValueError("Token expired")
        return data
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {e}")

# ── Users (простая проверка без bcrypt) ──────────────────────────────────────
USERS = {
    "admin":   {"password": "omniq_admin_2024", "role": "admin"},
    "analyst": {"password": "omniq_analyst_2024", "role": "analyst"},
    "viewer":  {"password": "omniq_viewer_2024", "role": "viewer"},
}

# ── Schemas ───────────────────────────────────────────────────────────────────
class LoginRequest(BaseModel):
    username: str
    password: str

class RegisterRequest(BaseModel):
    username: str
    email: EmailStr
    password: str
    company: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    username: str
    role: str


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def build_token_response(username: str, role: str) -> TokenResponse:
    return TokenResponse(
        access_token=create_token(username, role),
        username=username,
        role=role,
    )


async def ensure_db_connection() -> bool:
    if db_manager.is_connected:
        return True

    try:
        await db_manager.connect()
    except Exception:
        return False

    return db_manager.is_connected


async def find_neo4j_user(username: str):
    if not await ensure_db_connection():
        return None

    records = await db_manager.run_query(
        """
        MATCH (u:User {username: $username})
        RETURN
            u.username AS username,
            u.email AS email,
            u.password_hash AS password_hash,
            u.company AS company,
            u.role AS role
        LIMIT 1
        """,
        {"username": username},
    )
    return records[0] if records else None

# ── Endpoints ─────────────────────────────────────────────────────────────────
@router.post("/login", response_model=TokenResponse)
async def login(req: LoginRequest):
    user = USERS.get(req.username)
    if user and user["password"] == req.password:
        return build_token_response(req.username, user["role"])

    neo4j_user = await find_neo4j_user(req.username)
    if neo4j_user and neo4j_user.get("password_hash") == hash_password(req.password):
        return build_token_response(
            neo4j_user["username"],
            neo4j_user.get("role") or "viewer",
        )

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid credentials"
    )


@router.post("/register", response_model=TokenResponse)
async def register(req: RegisterRequest):
    if not await ensure_db_connection():
        raise HTTPException(status_code=503, detail="Neo4j not connected")

    username = req.username.strip()
    company = req.company.strip()
    email = str(req.email).strip().lower()

    existing_users = await db_manager.run_query(
        """
        MATCH (u:User)
        WHERE u.username = $username OR u.email = $email
        RETURN u.username AS username, u.email AS email
        LIMIT 1
        """,
        {"username": username, "email": email},
    )
    if existing_users:
        raise HTTPException(status_code=400, detail="Username or email already exists")

    await db_manager.run_query(
        """
        CREATE (u:User {
            username: $username,
            email: $email,
            password_hash: $password_hash,
            company: $company,
            role: $role,
            created_at: $created_at
        })
        RETURN u.username AS username
        """,
        {
            "username": username,
            "email": email,
            "password_hash": hash_password(req.password),
            "company": company,
            "role": "viewer",
            "created_at": datetime.now(timezone.utc).isoformat(),
        },
    )

    return build_token_response(username, "viewer")

@router.get("/me")
async def get_me(token: str = ""):
    if not token:
        raise HTTPException(status_code=401, detail="No token provided")
    data = verify_token(token)
    return {"username": data["sub"], "role": data["role"]}

@router.post("/verify")
async def verify(token: str = ""):
    data = verify_token(token)
    return {"valid": True, "username": data["sub"], "role": data["role"]}
