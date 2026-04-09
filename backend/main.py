"""
OMNIQ Decision Intelligence Platform - FastAPI application entry point.
"""
import asyncio
import os
from contextlib import asynccontextmanager, suppress

from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.database import db_manager
from app.routers.analytics import router as analytics_router
from app.routers import argus, aurora, auth, email, nexus
from app.routers import leads

APP_VERSION = "1.0.0"
NEO4J_KEEPALIVE_INTERVAL_SECONDS = 600


async def keep_neo4j_alive(stop_event: asyncio.Event) -> None:
    """Ping Neo4j periodically so the async driver stays warm."""
    while not stop_event.is_set():
        try:
            if db_manager.is_connected:
                await db_manager.run_query("RETURN 1 AS ok")
                print("[OMNIQ] Neo4j keepalive ping ok")
            else:
                await db_manager.connect()
        except Exception as exc:
            print(f"[OMNIQ] Neo4j keepalive failed: {exc}")

        try:
            await asyncio.wait_for(
                stop_event.wait(),
                timeout=NEO4J_KEEPALIVE_INTERVAL_SECONDS,
            )
        except asyncio.TimeoutError:
            continue


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application startup and shutdown lifecycle."""
    print(f"[OMNIQ] Starting up in '{settings.environment}' mode...")

    try:
        print(f"[OMNIQ] Connecting to Neo4j: {settings.neo4j_uri}")
        await db_manager.connect()
        print("[OMNIQ] Neo4j connection initialized")
    except Exception as exc:
        print(f"[OMNIQ] Neo4j connection failed: {exc}")

    stop_event = asyncio.Event()
    keepalive_task = asyncio.create_task(keep_neo4j_alive(stop_event))

    yield

    print("[OMNIQ] Shutting down...")
    stop_event.set()
    keepalive_task.cancel()
    with suppress(asyncio.CancelledError):
        await keepalive_task
    await db_manager.disconnect()


app = FastAPI(
    title="OMNIQ Decision Intelligence Platform",
    description="Palantir-class Decision Intelligence Platform for Central Asia.",
    version=APP_VERSION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(analytics_router)
app.include_router(argus.router, prefix="/api/argus", tags=["ARGUS - Graph Analytics"])
app.include_router(nexus.router, prefix="/api/nexus", tags=["NEXUS - Gov Intelligence"])
app.include_router(aurora.router, prefix="/api/aurora", tags=["AURORA - AI Decisions"])
app.include_router(email.router, prefix="/api/email", tags=["Email - Resend Integration"])
app.include_router(leads.router, prefix="/api/leads", tags=["Leads - Form Submissions"])


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(status_code=422, content={"detail": exc.errors()})


@app.get("/health", tags=["System"])
async def health_check():
    return JSONResponse(status_code=200, content={"status": "ok", "version": APP_VERSION})


@app.get("/", tags=["System"])
async def root():
    return {
        "status": "ok",
        "service": "OMNIQ API",
        "neo4j": "connected" if db_manager.is_connected else "disconnected",
    }


if __name__ == "__main__":
    import uvicorn

    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
