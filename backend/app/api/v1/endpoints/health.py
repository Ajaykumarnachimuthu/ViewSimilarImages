"""
Health check and diagnostic endpoint.
"""

from fastapi import APIRouter
from backend.app.core.config import settings
from backend.app.db.supabase_client import get_supabase_client

router = APIRouter()


@router.get("/health", summary="Health Check")
async def health_check():
    """
    Returns service health status, environment mode, and database connection status.
    """
    client = get_supabase_client()
    db_status = "connected" if client is not None else "local_catalog_mode"

    return {
        "status": "healthy",
        "project": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "database": db_status,
        "vision_provider": "PrototypeVisualSearchProvider",
    }
