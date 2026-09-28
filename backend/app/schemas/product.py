"""
Product schemas and filter parameter models.
"""

from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field
from backend.app.schemas.category import CategoryResponse
from backend.app.schemas.brand import BrandResponse
from backend.app.schemas.common import ColorSwatch, PaginatedResponse


class ProductFeatureSchema(BaseModel):
    feature_name: str
    feature_value: str

    model_config = ConfigDict(from_attributes=True)


class ProductBase(BaseModel):
    source: Optional[str] = Field("catalog", max_length=50)
    external_product_id: Optional[str] = Field(None, max_length=255)
    title: str = Field(..., max_length=255)
    slug: str = Field(..., max_length=280)
    description: str
    price: float = Field(..., ge=0.0)
    original_price: Optional[float] = Field(None, ge=0.0)
    category_id: str
    brand_id: str
    rating: float = Field(0.0, ge=0.0, le=5.0)
    review_count: int = Field(0, ge=0)
    stock: int = Field(0, ge=0)
    image_url: str
    thumbnail_url: Optional[str] = None
    is_featured: bool = False
    visual_tags: List[str] = Field(default_factory=list)
    dominant_colors: List[ColorSwatch] = Field(default_factory=list)


class ProductSummary(ProductBase):
    id: str
    category: Optional[CategoryResponse] = None
    brand: Optional[BrandResponse] = None

    model_config = ConfigDict(from_attributes=True)


class ProductDetail(ProductSummary):
    features: List[ProductFeatureSchema] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)


class ProductFilterParams(BaseModel):
    """Query parameters for catalog discovery."""
    q: Optional[str] = Field(None, description="Search query string")
    category_id: Optional[str] = Field(None, description="Category filter")
    brand_id: Optional[str] = Field(None, description="Brand filter")
    min_price: Optional[float] = Field(None, ge=0.0, description="Minimum price")
    max_price: Optional[float] = Field(None, ge=0.0, description="Maximum price")
    tags: Optional[List[str]] = Field(None, description="List of visual or attribute tags")
    is_featured: Optional[bool] = Field(None, description="Filter only featured")
    sort_by: str = Field("newest", pattern="^(newest|price_asc|price_desc|rating_desc)$")
    page: int = Field(1, ge=1)
    page_size: int = Field(12, ge=1, le=100)


class CatalogFacetsResponse(BaseModel):
    """Aggregate facet information for building interactive filter bars."""
    min_catalog_price: float
    max_catalog_price: float
    available_tags: List[str]
    categories: List[CategoryResponse]
    brands: List[BrandResponse]
