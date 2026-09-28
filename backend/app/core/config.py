"""
Core application settings and configuration management.
"""

from pathlib import Path
from typing import List, Union
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
    CORS_ORIGINS: Union[List[str], str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ]

    # Supabase Settings (Optional for standalone local testing)
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""  # Public anon key for read-only access
    SUPABASE_SERVICE_ROLE_KEY: str = ""  # Privileged service role key for backend catalog ingestion

    # Storage Settings
    STORAGE_BUCKET_PRODUCTS: str = "product-catalog-images"
    STORAGE_BUCKET_QUERIES: str = "visual-search-queries"
    LOCAL_STORAGE_PATH: str = "./uploads"

    # External Catalog Provider Settings
    EXTERNAL_PRODUCT_PROVIDER: str = "real_catalog"
    EBAY_CLIENT_ID: str = ""
    EBAY_CLIENT_SECRET: str = ""
    EBAY_ENVIRONMENT: str = "SANDBOX"

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
        env_file=(
            str(Path(__file__).resolve().parent.parent.parent / ".env"),
            ".env",
            "backend/.env",
        ),
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )


settings = Settings()
