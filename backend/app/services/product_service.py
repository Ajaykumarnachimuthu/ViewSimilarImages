"""
Product application service orchestrating catalog queries and business logic.
"""

import math
from typing import List, Optional
from backend.app.core.exceptions import EntityNotFoundError
from backend.app.repositories.product_repository import ProductRepository
from backend.app.schemas.common import PaginatedResponse
from backend.app.schemas.product import (
    CatalogFacetsResponse,
    ProductDetail,
    ProductFilterParams,
    ProductSummary,
)
from backend.app.services.vision_providers.base import VisualSearchProvider
from backend.app.services.vision_providers.prototype_provider import (
    PrototypeVisualSearchProvider,
)


class ProductService:
    """Application service for product discovery and details."""

    def __init__(
        self,
        repository: Optional[ProductRepository] = None,
        vision_provider: Optional[VisualSearchProvider] = None,
    ):
        self._repo = repository or ProductRepository()
        self._vision_provider = vision_provider or PrototypeVisualSearchProvider()

    async def get_product_by_id(self, product_id: str) -> ProductDetail:
        """Fetch product detail or raise 404."""
        product = await self._repo.get_by_id(product_id)
        if not product:
            raise EntityNotFoundError(entity_name="Product", identifier=product_id)
        return product

    async def list_products(
        self, filters: ProductFilterParams
    ) -> PaginatedResponse[ProductSummary]:
        """Fetch paginated, filtered catalog items."""
        items, total = await self._repo.search_and_filter(filters)
        total_pages = math.ceil(total / filters.page_size) if filters.page_size > 0 else 1

        return PaginatedResponse(
            items=items,
            total=total,
            page=filters.page,
            page_size=filters.page_size,
            total_pages=total_pages,
        )

    async def get_catalog_facets(self) -> CatalogFacetsResponse:
        """Fetch dynamic facets for filter sidebar."""
        return await self._repo.get_facets()

    async def get_visually_similar(
        self, product_id: str, limit: int = 6
    ) -> List[dict]:
        """
        Find products visually similar to an existing catalog product.
        Uses the product's dominant colors, visual tags, and category.
        """
        ref_product = await self.get_product_by_id(product_id)
        candidates = await self._repo.list_all_candidates_for_vision()

        # Exclude self
        candidates = [c for c in candidates if c.id != product_id]

        # Use vision provider to score similarity
        scored_items = []
        for candidate in candidates:
            # Score against reference item
            # Synthetic query features based on reference product's attributes
            from backend.app.services.vision_providers.base import ExtractedVisualFeatures
            query_feat = ExtractedVisualFeatures(
                dominant_colors=ref_product.dominant_colors,
                detected_tags=ref_product.visual_tags,
                aspect_ratio=1.0,
            )
            score, breakdown, shared = self._vision_provider.compute_similarity(
                query_feat, candidate
            )
            scored_items.append(
                {
                    "product": candidate,
                    "similarity_score": score,
                    "similarity_breakdown": breakdown,
                    "shared_visual_attributes": shared,
                }
            )

        scored_items.sort(key=lambda x: x["similarity_score"], reverse=True)
        return scored_items[:limit]
