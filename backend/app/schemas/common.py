"""
Common reusable Pydantic schemas.
"""

from typing import Generic, List, Optional, TypeVar
from pydantic import BaseModel, Field

T = TypeVar("T")


class ColorSwatch(BaseModel):
    """Extracted or assigned dominant color swatch."""
    hex: str = Field(..., description="Hexadecimal color representation (e.g. #1e293b)")
    name: str = Field(..., description="Human descriptive color name")
    ratio: float = Field(..., ge=0.0, le=1.0, description="Area ratio representation in image")


class PaginatedResponse(BaseModel, Generic[T]):
    """Standardized envelope for paginated collections."""
    items: List[T]
    total: int = Field(..., ge=0, description="Total number of items matching criteria")
    page: int = Field(..., ge=1, description="Current page number")
    page_size: int = Field(..., ge=1, description="Items per page")
    total_pages: int = Field(..., ge=0, description="Calculated total pages")


class ErrorResponse(BaseModel):
    """Standardized API error envelope."""
    error: str
    message: str
    details: Optional[dict] = None
    path: Optional[str] = None
