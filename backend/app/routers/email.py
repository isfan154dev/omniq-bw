"""
Email router for Resend-powered contact and access requests.
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr, Field
import resend

from app.config import settings


router = APIRouter()

REQUEST_ACCESS_TO = "isfandiyorsharipov7@gmail.com"
REQUEST_ACCESS_FROM = "OMNIQ Access <onboarding@resend.dev>"


class AccessRequest(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    company: str = Field(min_length=1, max_length=160)
    email: EmailStr
    message: str = Field(min_length=1, max_length=4000)


def _build_html(payload: AccessRequest) -> str:
    return f"""
    <h2>New OMNIQ access request</h2>
    <p><strong>Name:</strong> {payload.name}</p>
    <p><strong>Company:</strong> {payload.company}</p>
    <p><strong>Email:</strong> {payload.email}</p>
    <p><strong>Message:</strong></p>
    <p>{payload.message}</p>
    """


def _build_text(payload: AccessRequest) -> str:
    return (
        "New OMNIQ access request\n\n"
        f"Name: {payload.name}\n"
        f"Company: {payload.company}\n"
        f"Email: {payload.email}\n\n"
        "Message:\n"
        f"{payload.message}"
    )


@router.post("/request-access")
async def request_access(payload: AccessRequest):
    if not settings.resend_api_key:
        raise HTTPException(status_code=500, detail="RESEND_API_KEY is not configured")

    resend.api_key = settings.resend_api_key

    try:
        resend.Emails.send(
            {
                "from": REQUEST_ACCESS_FROM,
                "to": [REQUEST_ACCESS_TO],
                "subject": f"OMNIQ access request from {payload.name}",
                "reply_to": payload.email,
                "html": _build_html(payload),
                "text": _build_text(payload),
            }
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to send email: {exc}") from exc

    return {"success": True}
