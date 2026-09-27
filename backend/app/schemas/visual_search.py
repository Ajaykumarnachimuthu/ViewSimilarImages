"""
Visual search schemas.
"""

from typing import List, Optional
from pydantic import BaseModel, Field
from backend.app.schemas.common import ColorSwatch
from backend.app.schemas.product import ProductSummary


class SimilarityBreakdown(BaseModel):
    """Granular match score components."""
    color_similarity: float = Field(..., ge=0.0, le=1.0)
    structure_similarity: float = Field(..., ge=0.0, le=1.0)
    tag_overlap: float = Field(..., ge=0.0, le=1.0)


class VisualQueryAnalysis(BaseModel):
    """Analysis extracted from the query image."""
    dominant_colors: List[ColorSwatch] = Field(default_factory=list)
    detected_tags: List[str] = Field(default_factory=list)
    suggested_category: Optional[str] = None
    aspect_ratio: Optional[float] = None


class VisualSearchResultItem(BaseModel):
    """Single ranked match returned by visual search."""
    product: ProductSummary
    similarity_score: float = Field(..., ge=0.0, le=1.0)
    similarity_breakdown: SimilarityBreakdown
    shared_visual_attributes: List[str] = Field(default_factory=list)


class VisualSearchResponse(BaseModel):
    """Response returned by the visual search API endpoint."""
    query_analysis: VisualQueryAnalysis
    results: List[VisualSearchResultItem]
    fallback_used: bool = False
    fallback_message: Optional[str] = None
    total_matches: int = 0
