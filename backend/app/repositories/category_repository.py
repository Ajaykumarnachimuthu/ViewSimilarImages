"""
Category and Brand repository for database operations.
"""

import json
import logging
from pathlib import Path
from typing import Dict, List, Optional
from backend.app.db.supabase_client import get_supabase_client
from backend.app.schemas.category import CategoryResponse
from backend.app.schemas.brand import BrandResponse

logger = logging.getLogger(__name__)


class CategoryRepository:
    """Repository handling categories and brands."""

    def __init__(self, seed_file_path: Optional[str] = None):
        self._seed_path = seed_file_path or str(
            Path(__file__).resolve().parent.parent.parent / "seed" / "seed_data.json"
        )
        self._categories_cache: Dict[str, dict] = {}
        self._brands_cache: Dict[str, dict] = {}
        self._load_seed_cache()

    def _load_seed_cache(self):
        try:
            with open(self._seed_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                self._categories_cache = {c["id"]: c for c in data.get("categories", [])}
                self._brands_cache = {b["id"]: b for b in data.get("brands", [])}
        except Exception as exc:
            logger.error("Failed to load seed categories/brands: %s", exc)

    async def list_categories(self) -> List[CategoryResponse]:
        """Fetch all categories."""
        client = get_supabase_client()
        if client:
            try:
                response = client.table("categories").select("*").execute()
                return [CategoryResponse(**row) for row in response.data]
            except Exception as exc:
                logger.warning("Supabase category fetch error (%s), using local cache", exc)

        return [CategoryResponse(**c) for c in self._categories_cache.values()]

    async def get_category_by_id(self, category_id: str) -> Optional[CategoryResponse]:
        """Get category by UUID."""
        client = get_supabase_client()
        if client:
            try:
                response = client.table("categories").select("*").eq("id", category_id).execute()
                if response.data:
                    return CategoryResponse(**response.data[0])
            except Exception as exc:
                logger.warning("Supabase category get error (%s), using local cache", exc)

        item = self._categories_cache.get(category_id)
        return CategoryResponse(**item) if item else None

    async def list_brands(self) -> List[BrandResponse]:
        """Fetch all brands."""
        client = get_supabase_client()
        if client:
            try:
                response = client.table("brands").select("*").execute()
                return [BrandResponse(**row) for row in response.data]
            except Exception as exc:
                logger.warning("Supabase brands fetch error (%s), using local cache", exc)

        return [BrandResponse(**b) for b in self._brands_cache.values()]

    async def get_brand_by_id(self, brand_id: str) -> Optional[BrandResponse]:
        """Get brand by UUID."""
        client = get_supabase_client()
        if client:
            try:
                response = client.table("brands").select("*").eq("id", brand_id).execute()
                if response.data:
                    return BrandResponse(**response.data[0])
            except Exception as exc:
                logger.warning("Supabase brand get error (%s), using local cache", exc)

        item = self._brands_cache.get(brand_id)
        return BrandResponse(**item) if item else None
