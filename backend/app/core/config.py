"""
Core application settings and configuration management.
"""

from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field, field_validator


class Settings(BaseSettings):
    """Application configuration settings."""

    # Server Info
    PROJECT_NAME: str = "VISION2WEB — Visual Product Finder"
    VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api/v1"
    ENVIRONMENT: str = "development"
    HOST: str = "127.0.0.1"
    PORT: int = 8000
    DEBUG: bool = True
    LOG_LEVEL: str = "INFO"

    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ]

    # Supabase Settings (Optional for standalone local testing)
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""

    # Storage Settings
    STORAGE_BUCKET_PRODUCTS: str = "product-catalog-images"
    STORAGE_BUCKET_QUERIES: str = "visual-search-queries"
    LOCAL_STORAGE_PATH: str = "./uploads"

    # Visual Search Engine Settings
    VISUAL_SEARCH_PROVIDER: str = "prototype"
    MIN_SIMILARITY_THRESHOLD: float = 0.35
    MAX_UPLOAD_SIZE_BYTES: int = 5 * 1024 * 1024  # 5 MB

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v):
        if isinstance(v, str):
            return [i.strip() for i in v.split(",") if i.strip()]
        return v

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )


settings = Settings()
