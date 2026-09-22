from pydantic import BaseModel, Field
from typing import Optional, Literal, Any
import os
from dotenv import load_dotenv

# Load .env from matrixone project root or current working dir
_root_env = os.path.join(os.path.dirname(__file__), "..", "..", ".env")
if os.path.exists(_root_env):
    load_dotenv(_root_env)
load_dotenv()


class Settings(BaseModel):
    """Application settings loaded from environment variables."""

    # Database - try multiple env var names
    database_url: str = Field(
        default=os.environ.get("DATABASE_URL", "sqlite:///matrixone.db"),
        alias="DATABASE_URL",
    )
    # Redis
    redis_url: str = Field(
        default="redis://localhost:6379/0",
        alias="REDIS_URL",
    )
    # Security
    secret_key: str = Field(
        default="-change-me-in-production",
        alias="SECRET_KEY",
    )
    algorithm: str = Field(default="HS256", alias="ALGORITHM")
    access_token_expire_minutes: int = Field(
        default=30, alias="ACCESS_TOKEN_EXPIRE_MINUTES"
    )
    # AI/ML
    embedding_model_name: str = Field(
        default="all-MiniLM-L6-v2",
        alias="EMBEDDING_MODEL_NAME",
    )
    # Server
    host: str = Field(default="0.0.0.0", alias="HOST")
    port: int = Field(default=8000, alias="PORT")
    # Environment
    environment: Literal["development", "staging", "production"] = Field(
        default="development", alias="ENVIRONMENT"
    )
    # File upload limits
    max_upload_size: int = Field(
        default=104_857_600, alias="MAX_UPLOAD_SIZE"
    )  # 100MB
    # Allowed organizations
    demo_organizations: list[str] = Field(
        default=["CPCL-DEMO", "ONGC-DEMO", "NTPC-DEMO"],
        alias="DEMO_ORGANIZATIONS",
    )

    class Config:
        # Load from environment variables with exact names (no prefix)
        env_file = ".env"
        env_nested = True

    def _initialize(self):
        """Initialize after validation - pick up env vars."""
        # Pydantic v2 reads env vars by field name or alias
        # We need to manually check for DATABASE_URL env var
        env_url = os.environ.get("DATABASE_URL")
        if env_url and env_url != self.database_url:
            self.database_url = env_url


# Singleton instance - loaded at app startup
settings: Optional[Settings] = None


def get_settings():
    """Dependency-injected settings instance."""
    global settings
    if settings is None:
        settings = Settings()
        settings._initialize()
    return settings