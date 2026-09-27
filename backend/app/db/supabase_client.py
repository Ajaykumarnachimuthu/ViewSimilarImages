"""
Supabase client initialization and connection management.
"""

import logging
from typing import Optional
from supabase import create_client, Client
from backend.app.core.config import settings

logger = logging.getLogger(__name__)

_supabase_client: Optional[Client] = None


def get_supabase_client() -> Optional[Client]:
    """
    Get or initialize the singleton Supabase client.
    Returns None if SUPABASE_URL or SUPABASE_KEY are not configured,
    which triggers the repository layer to use the local seed catalog.
    """
    global _supabase_client
    if _supabase_client is not None:
        return _supabase_client

    if settings.SUPABASE_URL and settings.SUPABASE_KEY:
        try:
            logger.info("Connecting to Supabase at %s", settings.SUPABASE_URL)
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
