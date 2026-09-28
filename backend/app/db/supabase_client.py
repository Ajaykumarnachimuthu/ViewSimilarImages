"""
Supabase client initialization and connection management.
"""

import logging
from typing import Optional
from supabase import create_client, Client
from backend.app.core.config import settings

logger = logging.getLogger(__name__)

_supabase_client: Optional[Client] = None
_supabase_admin_client: Optional[Client] = None


def get_supabase_client() -> Optional[Client]:
    """
    Get or initialize the singleton Supabase client using the anon key (read-only per RLS).
    Returns None if SUPABASE_URL or SUPABASE_KEY are not configured.
    """
    global _supabase_client
    if _supabase_client is not None:
        return _supabase_client

    if settings.SUPABASE_URL and settings.SUPABASE_KEY:
        try:
            logger.info("Connecting to Supabase (public read) at %s", settings.SUPABASE_URL)
            _supabase_client = create_client(
                settings.SUPABASE_URL,
                settings.SUPABASE_KEY
            )
            return _supabase_client
        except Exception as exc:
            logger.warning(
                "Could not initialize Supabase client (%s). Operating in local repository mode.",
                exc
            )
            return None
    else:
        logger.info(
            "Supabase credentials not configured in environment. Operating in seed repository mode."
        )
        return None


def get_supabase_admin_client() -> Optional[Client]:
    """
    Get or initialize the privileged Supabase admin client using the service role key.
    Used exclusively for backend catalog ingestion and administrative synchronization that bypasses RLS.
    Falls back to SUPABASE_KEY if service role key is not configured.
    """
    global _supabase_admin_client
    if _supabase_admin_client is not None:
        return _supabase_admin_client

    key = settings.SUPABASE_SERVICE_ROLE_KEY or settings.SUPABASE_KEY
    if settings.SUPABASE_URL and key:
        try:
            is_service_role = bool(settings.SUPABASE_SERVICE_ROLE_KEY)
            logger.info(
                "Connecting to Supabase admin (%s) at %s",
                "service-role privileged" if is_service_role else "standard key",
                settings.SUPABASE_URL
            )
            _supabase_admin_client = create_client(
                settings.SUPABASE_URL,
                key
            )
            return _supabase_admin_client
        except Exception as exc:
            logger.warning("Could not initialize Supabase admin client: %s", exc)
            return None
    return None
