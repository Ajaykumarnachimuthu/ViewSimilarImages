"""
API integration tests for product discovery and visual search endpoints.
"""

import pytest


@pytest.mark.asyncio
async def test_health_check(async_client):
    response = await async_client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "version" in data


@pytest.mark.asyncio
async def test_list_products_default(async_client):
    response = await async_client.get("/api/v1/products")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data
    assert len(data["items"]) > 0
    assert data["page"] == 1


@pytest.mark.asyncio
async def test_search_products_keyword(async_client):
    response = await async_client.get("/api/v1/products?q=sneaker")
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) > 0
    for item in data["items"]:
        text = (item["title"] + item["description"] + " ".join(item["visual_tags"])).lower()
        assert "sneaker" in text


@pytest.mark.asyncio
async def test_filter_products_price(async_client):
    response = await async_client.get("/api/v1/products?min_price=150&max_price=250")
    assert response.status_code == 200
    data = response.json()
    for item in data["items"]:
        assert 150 <= item["price"] <= 250


@pytest.mark.asyncio
async def test_get_product_detail_and_404(async_client):
    # First get a valid product ID
    list_res = await async_client.get("/api/v1/products?page_size=1")
    valid_id = list_res.json()["items"][0]["id"]

    detail_res = await async_client.get(f"/api/v1/products/{valid_id}")
    assert detail_res.status_code == 200
    assert detail_res.json()["id"] == valid_id
    assert "features" in detail_res.json()

    # Test 404
    missing_res = await async_client.get("/api/v1/products/non-existent-uuid")
    assert missing_res.status_code == 404
    assert missing_res.json()["error"] == "PRODUCT_NOT_FOUND"


@pytest.mark.asyncio
async def test_categories_and_facets(async_client):
    cat_res = await async_client.get("/api/v1/categories")
    assert cat_res.status_code == 200
    assert len(cat_res.json()) > 0

    facet_res = await async_client.get("/api/v1/products/facets")
    assert facet_res.status_code == 200
    facets = facet_res.json()
    assert "min_catalog_price" in facets
    assert "available_tags" in facets


@pytest.mark.asyncio
async def test_visual_search_upload_success(async_client, sample_jpeg_bytes):
    files = {"file": ("test.jpg", sample_jpeg_bytes, "image/jpeg")}
    response = await async_client.post("/api/v1/visual-search", files=files)
    assert response.status_code == 200
    data = response.json()
    assert "query_analysis" in data
    assert "results" in data
    assert len(data["query_analysis"]["dominant_colors"]) > 0
    assert len(data["results"]) > 0
    # Every result must have similarity_score and breakdown
    first_match = data["results"][0]
    assert 0.0 <= first_match["similarity_score"] <= 1.0
    assert "color_similarity" in first_match["similarity_breakdown"]


@pytest.mark.asyncio
async def test_visual_search_invalid_file_rejected(async_client):
    files = {"file": ("fake.jpg", b"not an image at all", "image/jpeg")}
    response = await async_client.post("/api/v1/visual-search", files=files)
    assert response.status_code == 400
    assert response.json()["error"] == "SECURITY_VALIDATION_FAILED"
