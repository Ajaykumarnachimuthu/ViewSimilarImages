"""
Unit & integration tests for external product providers and ingestion models.
"""

import pytest
from backend.app.services.product_providers.base import ExternalProductDTO
from backend.app.services.product_providers.real_catalog_provider import (
    RealCatalogProductProvider,
)
from backend.app.services.product_providers.ebay_provider import EbayProductProvider
from backend.app.services.product_providers import get_external_product_provider


def test_external_product_dto_validation():
    """Verify provider-neutral DTO enforces types and constraints."""
    dto = ExternalProductDTO(
        external_id="ext-101",
        source="unit_test",
        title="Minimalist Mechanical Keyboard",
        description="Low profile wireless mechanical keyboard with hot-swappable switches",
        price=129.99,
        original_price=149.99,
        category_name="Electronics & Audio",
        category_slug="electronics-audio",
        brand_name="Keychron",
        brand_slug="keychron",
        image_url="https://images.unsplash.com/photo-1587829741301-dc798b83add3",
        visual_tags=["keyboard", "electronics", "minimalist", "wireless"],
        features={"Switches": "Gateron Red", "Connectivity": "Bluetooth 5.1 & Type-C"},
    )
    assert dto.external_id == "ext-101"
    assert dto.price == 129.99
    assert dto.category_slug == "electronics-audio"
    assert len(dto.visual_tags) == 4


def test_ebay_provider_initialization():
    """Verify EbayProductProvider initializes cleanly with environment parameters."""
    provider = EbayProductProvider(
        client_id="test_client_id",
        client_secret="test_secret",
        environment="SANDBOX",
    )
    assert provider.get_provider_name() == "ebay_browse_api"
    assert provider.environment == "SANDBOX"
    assert "sandbox.ebay.com" in provider.api_base_url


def test_default_provider_factory():
    """Verify provider factory returns RealCatalogProductProvider by default."""
    provider = get_external_product_provider()
    assert provider.get_provider_name() == "real_online_catalog"


@pytest.mark.asyncio
async def test_real_catalog_provider_fetch():
    """Verify RealCatalogProductProvider fetches real products and normalizes correctly."""
    provider = RealCatalogProductProvider()
    products = await provider.fetch_products(limit=5)

    assert len(products) > 0
    for p in products:
        assert isinstance(p, ExternalProductDTO)
        assert p.title
        assert p.price > 0
        assert p.image_url.startswith("http")
        assert p.category_slug in {
            "outerwear-apparel",
            "footwear",
            "electronics-audio",
            "home-living",
            "watches-accessories",
        }
