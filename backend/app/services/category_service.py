"""
Category and Brand application services.
"""

from typing import List, Optional
from backend.app.repositories.category_repository import CategoryRepository
from backend.app.schemas.category import CategoryResponse
from backend.app.schemas.brand import BrandResponse


class CategoryService:
    """Application service for categories and brands."""

    def __init__(self, repository: Optional[CategoryRepository] = None):
        self._repo = repository or CategoryRepository()

    async def list_categories(self) -> List[CategoryResponse]:
        return await self._repo.list_categories()

    async def list_brands(self) -> List[BrandResponse]:
        return await self._repo.list_brands()
