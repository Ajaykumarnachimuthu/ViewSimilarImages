"""
Product repository handling database access, queries, and filters.
"""

import json
import logging
from pathlib import Path
from typing import Dict, List, Optional, Tuple
from backend.app.db.supabase_client import get_supabase_client
from backend.app.repositories.category_repository import CategoryRepository
from backend.app.schemas.product import (
    CatalogFacetsResponse,
    ProductDetail,
    ProductFilterParams,
    ProductSummary,
)

logger = logging.getLogger(__name__)


class ProductRepository:
    """Encapsulates all product data queries."""

    def __init__(
        self,
        category_repo: Optional[CategoryRepository] = None,
        seed_file_path: Optional[str] = None,
    ):
        self._category_repo = category_repo or CategoryRepository(seed_file_path)
        self._seed_path = seed_file_path or str(
            Path(__file__).resolve().parent.parent.parent / "seed" / "seed_data.json"
        )
        self._products_cache: Dict[str, dict] = {}
        self._load_seed_cache()

    def _load_seed_cache(self):
        try:
            with open(self._seed_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                self._products_cache = {p["id"]: p for p in data.get("products", [])}
        except Exception as exc:
            logger.error("Failed to load seed products: %s", exc)

    async def _hydrate_product_summary(self, raw: dict) -> ProductSummary:
        """Hydrate category and brand references into ProductSummary."""
        category = await self._category_repo.get_category_by_id(raw.get("category_id", ""))
        brand = await self._category_repo.get_brand_by_id(raw.get("brand_id", ""))
        return ProductSummary(**raw, category=category, brand=brand)

    async def _hydrate_product_detail(self, raw: dict) -> ProductDetail:
        """Hydrate full product details including features."""
        category = await self._category_repo.get_category_by_id(raw.get("category_id", ""))
        brand = await self._category_repo.get_brand_by_id(raw.get("brand_id", ""))
        return ProductDetail(**raw, category=category, brand=brand)

    async def get_by_id(self, product_id: str) -> Optional[ProductDetail]:
        """Retrieve complete product detail by ID."""
        client = get_supabase_client()
        if client:
            try:
                res = (
                    client.table("products")
                    .select("*, product_features(*)")
                    .eq("id", product_id)
                    .execute()
                )
                if res.data:
                    row = res.data[0]
                    # Format product_features to features
                    features = row.pop("product_features", [])
                    row["features"] = features
                    return await self._hydrate_product_detail(row)
            except Exception as exc:
                logger.warning("Supabase product detail get error (%s), using cache", exc)

        item = self._products_cache.get(product_id)
        if not item:
            return None
        return await self._hydrate_product_detail(item)

    async def search_and_filter(
        self, filters: ProductFilterParams
    ) -> Tuple[List[ProductSummary], int]:
        """
        Execute full catalog search with dynamic criteria:
        - Text search across title, description, and visual tags
        - Category & brand filters
        - Price boundary constraints
        - Sorting and pagination
        """
        client = get_supabase_client()
        if client:
            try:
                query = client.table("products").select("*", count="exact")
                if filters.q:
                    # Supabase full-text search
                    query = query.text_search("title,description", filters.q)
                if filters.category_id:
                    query = query.eq("category_id", filters.category_id)
                if filters.brand_id:
                    query = query.eq("brand_id", filters.brand_id)
                if filters.min_price is not None:
                    query = query.gte("price", filters.min_price)
                if filters.max_price is not None:
                    query = query.lte("price", filters.max_price)
                if filters.is_featured is not None:
                    query = query.eq("is_featured", filters.is_featured)

                # Sorting
                if filters.sort_by == "price_asc":
                    query = query.order("price", desc=False)
                elif filters.sort_by == "price_desc":
                    query = query.order("price", desc=True)
                elif filters.sort_by == "rating_desc":
                    query = query.order("rating", desc=True)
                else:
                    query = query.order("created_at", desc=True)

                # Pagination
                start = (filters.page - 1) * filters.page_size
                end = start + filters.page_size - 1
                query = query.range(start, end)

                res = query.execute()
                total = res.count or len(res.data)
                items = [await self._hydrate_product_summary(r) for r in res.data]
                return items, total
            except Exception as exc:
                logger.warning("Supabase query error (%s), using local repository engine", exc)

        # Fallback Local In-Memory Relational Engine
        candidates = list(self._products_cache.values())

        # 1. Text Search Filter
        if filters.q:
            q_lower = filters.q.lower().strip()
            candidates = [
                p
                for p in candidates
                if q_lower in p["title"].lower()
                or q_lower in p["description"].lower()
                or any(q_lower in tag.lower() for tag in p.get("visual_tags", []))
            ]

        # 2. Category Filter
        if filters.category_id:
            candidates = [p for p in candidates if p.get("category_id") == filters.category_id]

        # 3. Brand Filter
        if filters.brand_id:
            candidates = [p for p in candidates if p.get("brand_id") == filters.brand_id]

        # 4. Price Boundaries
        if filters.min_price is not None:
            candidates = [p for p in candidates if p.get("price", 0) >= filters.min_price]
        if filters.max_price is not None:
            candidates = [p for p in candidates if p.get("price", 0) <= filters.max_price]

        # 5. Tag Filter
        if filters.tags:
            tag_set = set(t.lower() for t in filters.tags)
            candidates = [
                p
                for p in candidates
                if any(t.lower() in tag_set for t in p.get("visual_tags", []))
            ]

        # 6. Featured Filter
        if filters.is_featured is not None:
            candidates = [p for p in candidates if p.get("is_featured") == filters.is_featured]

        # 7. Sorting
        if filters.sort_by == "price_asc":
            candidates.sort(key=lambda x: x.get("price", 0))
        elif filters.sort_by == "price_desc":
            candidates.sort(key=lambda x: x.get("price", 0), reverse=True)
        elif filters.sort_by == "rating_desc":
            candidates.sort(key=lambda x: (x.get("rating", 0), x.get("review_count", 0)), reverse=True)
        else:  # newest
            candidates.sort(key=lambda x: x.get("title", ""))

        total = len(candidates)
        start = (filters.page - 1) * filters.page_size
        end = start + filters.page_size
        paged = candidates[start:end]

        hydrated = [await self._hydrate_product_summary(p) for p in paged]
        return hydrated, total

    async def list_all_candidates_for_vision(
        self, category_id: Optional[str] = None
    ) -> List[ProductSummary]:
        """Fetch all products for visual similarity evaluation."""
        params = ProductFilterParams(
            category_id=category_id,
            page=1,
            page_size=100,
        )
        items, _ = await self.search_and_filter(params)
        return items

    async def get_facets(self) -> CatalogFacetsResponse:
        """Aggregate dynamic catalog facets."""
        categories = await self._category_repo.list_categories()
        brands = await self._category_repo.list_brands()

        client = get_supabase_client()
        if client:
            try:
                res = client.table("products").select("price, visual_tags").execute()
                if res.data:
                    prices = [float(r["price"]) for r in res.data if r.get("price") is not None]
                    min_p = min(prices) if prices else 0.0
                    max_p = max(prices) if prices else 1000.0
                    all_tags = set()
                    for r in res.data:
                        for t in (r.get("visual_tags") or []):
                            all_tags.add(t)
                    return CatalogFacetsResponse(
                        min_catalog_price=min_p,
                        max_catalog_price=max_p,
                        available_tags=sorted(list(all_tags)),
                        categories=categories,
                        brands=brands,
                    )
            except Exception as exc:
                logger.warning("Supabase facet query error (%s), using local cache", exc)

        prices = [p.get("price", 0) for p in self._products_cache.values()]
        min_p = min(prices) if prices else 0.0
        max_p = max(prices) if prices else 1000.0

        all_tags = set()
        for p in self._products_cache.values():
            for t in p.get("visual_tags", []):
                all_tags.add(t)

        return CatalogFacetsResponse(
            min_catalog_price=min_p,
            max_catalog_price=max_p,
            available_tags=sorted(list(all_tags)),
            categories=categories,
            brands=brands,
        )
