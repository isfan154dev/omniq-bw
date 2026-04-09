"""
OMNIQ Platform — Application Configuration
Uses pydantic-settings to load config from environment variables / .env file.
"""
import json
from typing import List
from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Central configuration for the OMNIQ platform backend."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ── Neo4j ─────────────────────────────────────────────────────────────────
    neo4j_uri: str = "bolt://localhost:7687"
    neo4j_user: str = "neo4j"
    neo4j_password: str = ""

    # ── JWT Auth ──────────────────────────────────────────────────────────────
    secret_key: str = ""
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    # ── App ───────────────────────────────────────────────────────────────────
    environment: str = "development"
    debug: bool = False
    app_name: str = "OMNIQ Decision Intelligence Platform"
    app_version: str = "2.4.1"
    resend_api_key: str = ""

    # ── CORS ──────────────────────────────────────────────────────────────────
    allowed_origins: List[str] = Field(default_factory=lambda: [
        "http://localhost:3000",
        "http://localhost:5173",
        "https://omniq.platform",
        "https://omniq-platform.vercel.app",
    ])

    @field_validator("allowed_origins", mode="before")
    @classmethod
    def parse_allowed_origins(cls, value):
        if isinstance(value, list):
            return value
        if isinstance(value, str):
            value = value.strip()
            if not value:
                return []
            if value.startswith("["):
                parsed = json.loads(value)
                if isinstance(parsed, list):
                    return parsed
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return value

    @property
    def neo4j_password_safe(self) -> str:
        """bcrypt supports max 72 bytes — truncate if needed."""
        return self.neo4j_password[:72]

    @property
    def is_production(self) -> bool:
        return self.environment.lower() == "production"

    @property
    def is_development(self) -> bool:
        return self.environment.lower() == "development"


settings = Settings()
