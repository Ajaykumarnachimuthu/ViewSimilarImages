"""
Visual search provider interface and feature contracts.
"""

from abc import ABC, abstractmethod
from typing import List, Optional, Tuple
from pydantic import BaseModel, Field
from backend.app.schemas.common import ColorSwatch
from backend.app.schemas.product import ProductSummary
from backend.app.schemas.visual_search import (
    SimilarityBreakdown,
    VisualSearchResultItem,
)


class ExtractedVisualFeatures(BaseModel):
    """Normalized visual features extracted from an image."""
    color_histogram: List[float] = Field(default_factory=list)
    perceptual_hash: str = Field("", description="64-bit binary or hex dHash")
    dominant_colors: List[ColorSwatch] = Field(default_factory=list)
    detected_tags: List[str] = Field(default_factory=list)
    aspect_ratio: float = 1.0
    suggested_category: Optional[str] = None


class VisualSearchProvider(ABC):
    """
    Abstract interface for visual search backends.
    All vision implementations (Prototype, CLIP, pgvector) must conform to this contract.
    """

    @abstractmethod
    def extract_features(self, image_bytes: bytes) -> ExtractedVisualFeatures:
        """
        Analyze an input image stream and extract normalized visual descriptors.
        Must be pure algorithmic extraction (zero filename or mock switches).
        """
        pass

    @abstractmethod
    def compute_similarity(
        self,
        query_features: ExtractedVisualFeatures,
        candidate_product: ProductSummary,
    ) -> Tuple[float, SimilarityBreakdown, List[str]]:
        """
        Compute normalized similarity score (0.0 to 1.0), breakdown, and shared attributes.
        """
        pass

    @abstractmethod
    def rank_candidates(
        self,
        query_features: ExtractedVisualFeatures,
        candidates: List[ProductSummary],
        min_threshold: float = 0.35,
        limit: int = 12,
    ) -> List[VisualSearchResultItem]:
        """
        Rank a set of candidate products against extracted query features.
        """
        pass
