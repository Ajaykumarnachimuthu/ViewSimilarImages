"""
Embedding Visual Search Provider (Scaffold / Production Evolution Target).
Designed for CLIP / OpenCLIP embeddings and Supabase pgvector cosine search.
"""

from typing import List, Tuple
from backend.app.schemas.product import ProductSummary
from backend.app.schemas.visual_search import (
    SimilarityBreakdown,
    VisualSearchResultItem,
)
from backend.app.services.vision_providers.base import (
    ExtractedVisualFeatures,
    VisualSearchProvider,
)


class EmbeddingVisualSearchProvider(VisualSearchProvider):
    """
    CLIP-based vector embedding provider for future phase.
    Conforms to the exact same VisualSearchProvider interface.
    """

    def __init__(self, model_name: str = "ViT-B/32", device: str = "cpu"):
        self.model_name = model_name
        self.device = device
        # Note: In production phase, torch and clip model would load here.

    def extract_features(self, image_bytes: bytes) -> ExtractedVisualFeatures:
        """
        Generates 512-dimensional normalized CLIP embedding vector.
        """
        # Placeholder for CLIP forward pass
        raise NotImplementedError(
            "EmbeddingVisualSearchProvider requires CLIP model weights. "
            "Use PrototypeVisualSearchProvider for prototype phase."
        )

    def compute_similarity(
        self,
        query_features: ExtractedVisualFeatures,
        candidate_product: ProductSummary,
    ) -> Tuple[float, SimilarityBreakdown, List[str]]:
        raise NotImplementedError()

    def rank_candidates(
        self,
        query_features: ExtractedVisualFeatures,
        candidates: List[ProductSummary],
        min_threshold: float = 0.35,
        limit: int = 12,
    ) -> List[VisualSearchResultItem]:
        raise NotImplementedError()
