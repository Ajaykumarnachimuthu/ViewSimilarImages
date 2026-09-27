"""
Visual search API endpoints.
"""

from typing import Optional
from fastapi import APIRouter, Depends, File, Form, UploadFile
from backend.app.schemas.visual_search import VisualSearchResponse
from backend.app.services.visual_search_service import VisualSearchService

router = APIRouter()


def get_visual_search_service() -> VisualSearchService:
    return VisualSearchService()


@router.post(
    "/visual-search",
    response_model=VisualSearchResponse,
    summary="Search catalog using an uploaded image",
)
async def visual_search(
    file: UploadFile = File(..., description="Image file (JPEG, PNG, WEBP, max 5MB)"),
    min_similarity: Optional[float] = Form(None, ge=0.0, le=1.0),
    category_id: Optional[str] = Form(None),
    limit: int = Form(12, ge=1, le=36),
    service: VisualSearchService = Depends(get_visual_search_service),
):
    """
    Ingests an untrusted image file, validates its format and dimensions,
    extracts visual descriptors (color distribution, silhouette, tags),
    and returns ranked product results with similarity breakdown and fallback safety.
    """
    file_bytes = await file.read()
    return await service.search_by_image(
        file_bytes=file_bytes,
        original_filename=file.filename or "",
        min_similarity=min_similarity,
        category_id=category_id,
        limit=limit,
    )
