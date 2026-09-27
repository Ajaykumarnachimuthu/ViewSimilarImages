"""
Category and Brand endpoints.
"""

from typing import List
from fastapi import APIRouter, Depends
from backend.app.schemas.category import CategoryResponse
from backend.app.schemas.brand import BrandResponse
from backend.app.services.category_service import CategoryService

router = APIRouter()


def get_category_service() -> CategoryService:
    return CategoryService()


@router.get(
    "/categories",
    response_model=List[CategoryResponse],
    summary="List all product categories",
)
async def list_categories(
    service: CategoryService = Depends(get_category_service),
):
    return await service.list_categories()


@router.get(
    "/brands",
    response_model=List[BrandResponse],
    summary="List all brands",
)
async def list_brands(
    service: CategoryService = Depends(get_category_service),
):
    return await service.list_brands()
