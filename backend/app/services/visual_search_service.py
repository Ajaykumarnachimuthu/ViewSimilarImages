"""
Visual search application service orchestrating validation, feature extraction,
similarity ranking, and graceful fallback.
"""

import logging
from typing import Optional
from backend.app.core.config import settings
from backend.app.core.security import validate_image_upload
from backend.app.repositories.product_repository import ProductRepository
from backend.app.schemas.product import ProductFilterParams
from backend.app.schemas.visual_search import (
    SimilarityBreakdown,
    VisualQueryAnalysis,
    VisualSearchResponse,
    VisualSearchResultItem,
)
from backend.app.services.vision_providers.base import VisualSearchProvider
from backend.app.services.vision_providers.prototype_provider import (
    PrototypeVisualSearchProvider,
)

logger = logging.getLogger(__name__)


class VisualSearchService:
    """Orchestrates image-based product discovery."""

    def __init__(
        self,
        repository: Optional[ProductRepository] = None,
        vision_provider: Optional[VisualSearchProvider] = None,
    ):
        self._repo = repository or ProductRepository()
        self._vision_provider = vision_provider or PrototypeVisualSearchProvider()

    async def search_by_image(
        self,
        file_bytes: bytes,
        original_filename: str = "",
        min_similarity: Optional[float] = None,
        category_id: Optional[str] = None,
        limit: int = 12,
    ) -> VisualSearchResponse:
        """
        Full visual search execution pipeline:
        1. Validate untrusted image bytes (magic bytes, decompression bomb, size)
        2. Extract normalized visual descriptors (color histogram, dHash, swatches, tags)
        3. Retrieve candidate catalog items
        4. Calculate mathematical similarity & rank
        5. Trigger graceful fallback if results do not meet confidence threshold
        """
        # 1. Security validation
        safe_filename, detected_format = validate_image_upload(
            file_bytes=file_bytes,
            original_filename=original_filename,
        )
        logger.info(
            "Validated image upload. Safe filename: %s, format: %s",
            safe_filename,
            detected_format,
        )

        # 2. Extract visual features
        features = self._vision_provider.extract_features(file_bytes)

        query_analysis = VisualQueryAnalysis(
            dominant_colors=features.dominant_colors,
            detected_tags=features.detected_tags,
            suggested_category=features.suggested_category,
            aspect_ratio=features.aspect_ratio,
        )

        # 3. Retrieve candidates
        candidates = await self._repo.list_all_candidates_for_vision(
            category_id=category_id
        )

        threshold = (
            min_similarity
            if min_similarity is not None
            else settings.MIN_SIMILARITY_THRESHOLD
        )

        # 4. Rank candidates
        ranked_results = self._vision_provider.rank_candidates(
            query_features=features,
            candidates=candidates,
            min_threshold=threshold,
            limit=limit,
        )

        # 5. Fallback determination
        fallback_used = False
        fallback_message = None

        if not ranked_results:
            fallback_used = True
            category_hint = features.suggested_category or "featured collection"
            fallback_message = (
                f"No close visual match found above {int(threshold * 100)}% similarity. "
                f"Displaying top-rated alternatives in {category_hint}."
            )
            logger.info("Visual search activated graceful fallback: %s", fallback_message)

            # Retrieve top-rated catalog items as safe fallback
            fallback_params = ProductFilterParams(
                sort_by="rating_desc",
                page=1,
                page_size=limit,
            )
            fallback_items, _ = await self._repo.search_and_filter(fallback_params)

            # Wrap into response items with baseline breakdown
            ranked_results = [
                VisualSearchResultItem(
                    product=p,
                    similarity_score=0.40,
                    similarity_breakdown=SimilarityBreakdown(
                        color_similarity=0.40,
                        structure_similarity=0.40,
                        tag_overlap=0.40,
                    ),
                    shared_visual_attributes=["Trending Choice"],
                )
                for p in fallback_items[:limit]
            ]

        return VisualSearchResponse(
            query_analysis=query_analysis,
            results=ranked_results,
            fallback_used=fallback_used,
            fallback_message=fallback_message,
            total_matches=len(ranked_results),
        )
