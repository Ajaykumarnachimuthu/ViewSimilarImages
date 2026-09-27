"""
Category schemas.
"""

from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class CategoryBase(BaseModel):
    name: str = Field(..., max_length=100)
    slug: str = Field(..., max_length=120)
    description: Optional[str] = None
    icon: Optional[str] = None
    parent_id: Optional[str] = None


class CategoryResponse(CategoryBase):
    id: str
    product_count: Optional[int] = 0

    model_config = ConfigDict(from_attributes=True)
