"""
Abstract base class and data transfer objects for external product data providers.
"""

from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class ExternalProductDTO(BaseModel):
    """
    Provider-neutral normalized product DTO.
    Ensures upstream provider shapes never leak into the core application.
    """
    external_id: str
    source: str
    title: str
    description: str
    price: float = Field(ge=0.0)
    original_price: Optional[float] = None
    category_name: str
    category_slug: str
    brand_name: str
    brand_slug: str
    rating: float = Field(default=4.5, ge=0.0, le=5.0)
    review_count: int = Field(default=0, ge=0)
    stock: int = Field(default=10, ge=0)
    image_url: str
    thumbnail_url: Optional[str] = None
    visual_tags: List[str] = Field(default_factory=list)
    features: Dict[str, str] = Field(default_factory=dict)
    raw_metadata: Dict[str, Any] = Field(default_factory=dict)


class ExternalProductProvider(ABC):
    """Abstract interface for external e-commerce product providers."""

    @abstractmethod
    def get_provider_name(self) -> str:
        """Return the unique provider identifier."""
        pass

    @abstractmethod
    async def fetch_products(self, limit: int = 50) -> List[ExternalProductDTO]:
        """
        Fetch and return a list of normalized external products.
        """
        pass
