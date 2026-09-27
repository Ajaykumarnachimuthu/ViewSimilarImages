"""
Unit tests for mathematical vision provider feature extraction.
"""

import pytest
from PIL import Image
from backend.app.schemas.product import ProductSummary
from backend.app.services.vision_providers.prototype_provider import (
    PrototypeVisualSearchProvider,
)


@pytest.fixture
def provider():
    return PrototypeVisualSearchProvider()


def test_color_histogram_sums_to_one(provider, sample_jpeg_bytes):
    features = provider.extract_features(sample_jpeg_bytes)
    hist = features.color_histogram
    assert len(hist) == 64
    assert pytest.approx(sum(hist), 0.01) == 1.0


def test_dhash_length_is_64_bits(provider, sample_jpeg_bytes):
    features = provider.extract_features(sample_jpeg_bytes)
    assert len(features.perceptual_hash) == 64
    assert all(c in "01" for c in features.perceptual_hash)


def test_dominant_colors_extracted(provider, sample_jpeg_bytes):
    features = provider.extract_features(sample_jpeg_bytes)
    assert len(features.dominant_colors) > 0
    top = features.dominant_colors[0]
    assert top.hex.startswith("#")
    assert "Crimson" in top.name or "Red" in top.name


def test_rank_candidates_similarity_bounds(provider, sample_jpeg_bytes):
    features = provider.extract_features(sample_jpeg_bytes)
    # Synthetic candidate product
    candidate = ProductSummary(
        id="p1010102-1111-1111-1111-111111111111",
        title="Crimson Runner",
        slug="crimson-runner",
        description="Red shoes",
        price=140.0,
        category_id="c1111111-1111-1111-1111-111111111111",
        brand_id="b2222222-2222-2222-2222-222222222222",
        rating=4.7,
        review_count=100,
        stock=10,
        image_url="https://example.com/red.jpg",
        visual_tags=["sneakers", "red", "athletic"],
        dominant_colors=[{"hex": "#dc2626", "name": "Crimson Red", "ratio": 0.6}],
    )

    score, breakdown, shared = provider.compute_similarity(features, candidate)
    assert 0.0 <= score <= 1.0
    assert 0.0 <= breakdown.color_similarity <= 1.0
    assert 0.0 <= breakdown.structure_similarity <= 1.0
    assert 0.0 <= breakdown.tag_overlap <= 1.0
    assert score > 0.40  # Crimson matches crimson
