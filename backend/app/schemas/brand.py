"""
Brand schemas.
"""

from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class BrandBase(BaseModel):
    name: str = Field(..., max_length=100)
    slug: str = Field(..., max_length=120)
    logo_url: Optional[str] = None


class BrandResponse(BrandBase):
    id: str

    model_config = ConfigDict(from_attributes=True)
