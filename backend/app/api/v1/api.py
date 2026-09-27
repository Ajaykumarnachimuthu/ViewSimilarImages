"""
API V1 router aggregator.
"""

from fastapi import APIRouter
from backend.app.api.v1.endpoints import (
    categories,
    health,
    products,
    visual_search,
)

api_router = APIRouter()

api_router.include_router(health.router, tags=["Health"])
api_router.include_router(products.router, tags=["Products"])
api_router.include_router(categories.router, tags=["Categories & Brands"])
api_router.include_router(visual_search.router, tags=["Visual Search"])
