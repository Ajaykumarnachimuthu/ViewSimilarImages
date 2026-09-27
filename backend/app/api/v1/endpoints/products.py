"""
Product catalog API endpoints.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from backend.app.schemas.common import PaginatedResponse
from backend.app.schemas.product import (
    CatalogFacetsResponse,
    ProductDetail,
    ProductFilterParams,
    ProductSummary,
)
from backend.app.services.product_service import ProductService

router = APIRouter()


def get_product_service() -> ProductService:
    return ProductService()


@router.get(
    "/products",
    response_model=PaginatedResponse[ProductSummary],
    summary="List and filter catalog products",
)
async def list_products(
    q: Optional[str] = Query(None, description="Full text search term"),
    category_id: Optional[str] = Query(None, description="Category UUID"),
    brand_id: Optional[str] = Query(None, description="Brand UUID"),
    min_price: Optional[float] = Query(None, ge=0.0, description="Minimum price boundary"),
    max_price: Optional[float] = Query(None, ge=0.0, description="Maximum price boundary"),
    tags: Optional[str] = Query(None, description="Comma-separated attribute tags"),
    is_featured: Optional[bool] = Query(None, description="Filter featured items"),
    sort_by: str = Query("newest", pattern="^(newest|price_asc|price_desc|rating_desc)$"),
    page: int = Query(1, ge=1),
    page_size: int = Query(12, ge=1, le=48),
    service: ProductService = Depends(get_product_service),
):
    tag_list = [t.strip() for t in tags.split(",") if t.strip()] if tags else None
    params = ProductFilterParams(
        q=q,
        category_id=category_id,
        brand_id=brand_id,
        min_price=min_price,
        max_price=max_price,
        tags=tag_list,
        is_featured=is_featured,
        sort_by=sort_by,
        page=page,
        page_size=page_size,
    )
    return await service.list_products(params)


@router.get(
    "/products/facets",
    response_model=CatalogFacetsResponse,
    summary="Retrieve catalog dynamic facets",
)
async def get_catalog_facets(
    service: ProductService = Depends(get_product_service),
):
    return await service.get_catalog_facets()


@router.get(
    "/products/{id}",
    response_model=ProductDetail,
    summary="Retrieve comprehensive product details by ID",
)
async def get_product_detail(
    id: str,
    service: ProductService = Depends(get_product_service),
):
    return await service.get_product_by_id(id)


@router.get(
    "/products/{id}/visually-similar",
    summary="Find visually similar products for a reference catalog item",
)
async def get_visually_similar_products(
    id: str,
    limit: int = Query(6, ge=1, le=20),
    service: ProductService = Depends(get_product_service),
):
    matches = await service.get_visually_similar(id, limit=limit)
    return {
        "reference_product_id": id,
        "matches": matches,
    }
