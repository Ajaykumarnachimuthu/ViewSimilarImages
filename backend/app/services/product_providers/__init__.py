"""
Product providers package exports and factory.
"""

from backend.app.core.config import settings
from backend.app.services.product_providers.base import (
    ExternalProductDTO,
    ExternalProductProvider,
)
from backend.app.services.product_providers.ebay_provider import EbayProductProvider
from backend.app.services.product_providers.real_catalog_provider import (
    RealCatalogProductProvider,
)


def get_external_product_provider() -> ExternalProductProvider:
    """Return the configured external product provider."""
    provider_name = settings.EXTERNAL_PRODUCT_PROVIDER.lower()
    if provider_name == "ebay" and settings.EBAY_CLIENT_ID and settings.EBAY_CLIENT_SECRET:
        return EbayProductProvider()
    return RealCatalogProductProvider()


__all__ = [
    "ExternalProductDTO",
    "ExternalProductProvider",
    "EbayProductProvider",
    "RealCatalogProductProvider",
    "get_external_product_provider",
]
