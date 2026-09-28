"""
eBay Browse API external product provider implementation.
Implements OAuth Client Credentials grant and item discovery.
"""

import base64
import logging
from typing import List, Optional
import httpx
from backend.app.core.config import settings
from backend.app.services.product_providers.base import (
    ExternalProductDTO,
    ExternalProductProvider,
)

logger = logging.getLogger(__name__)


class EbayProductProvider(ExternalProductProvider):
    """
    eBay Browse API Provider.
    Ready for live integration as soon as EBAY_CLIENT_ID and EBAY_CLIENT_SECRET are supplied.
    """

    def __init__(
        self,
        client_id: Optional[str] = None,
        client_secret: Optional[str] = None,
        environment: Optional[str] = None,
    ):
        self.client_id = client_id or settings.EBAY_CLIENT_ID
        self.client_secret = client_secret or settings.EBAY_CLIENT_SECRET
        self.environment = (environment or settings.EBAY_ENVIRONMENT).upper()
        self._access_token: Optional[str] = None

        if self.environment == "PRODUCTION":
            self.auth_url = "https://api.ebay.com/identity/v1/oauth2/token"
            self.api_base_url = "https://api.ebay.com/buy/browse/v1"
        else:
            self.auth_url = "https://api.sandbox.ebay.com/identity/v1/oauth2/token"
            self.api_base_url = "https://api.sandbox.ebay.com/buy/browse/v1"

    def get_provider_name(self) -> str:
        return "ebay_browse_api"

    async def _authenticate(self) -> str:
        """Obtain an application access token using OAuth 2.0 Client Credentials."""
        if not self.client_id or not self.client_secret:
            raise ValueError(
                "eBay credentials missing. Please set EBAY_CLIENT_ID and EBAY_CLIENT_SECRET in backend/.env"
            )

        credentials = f"{self.client_id}:{self.client_secret}"
        encoded_cred = base64.b64encode(credentials.encode("utf-8")).decode("utf-8")

        headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": f"Basic {encoded_cred}",
        }
        data = {
            "grant_type": "client_credentials",
            "scope": "https://api.ebay.com/oauth/api_scope",
        }

        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.post(self.auth_url, headers=headers, data=data)
            resp.raise_for_status()
            payload = resp.json()
            self._access_token = payload.get("access_token")
            return self._access_token

    async def fetch_products(self, limit: int = 50) -> List[ExternalProductDTO]:
        """Fetch items from eBay Browse API and normalize to ExternalProductDTO."""
        if not self._access_token:
            await self._authenticate()

        headers = {
            "Authorization": f"Bearer {self._access_token}",
            "X-EBAY-C-MARKETPLACE-ID": "EBAY_US",
        }
        params = {
            "q": "footwear outerwear electronics watches home",
            "limit": min(limit, 50),
        }

        async with httpx.AsyncClient(timeout=20.0) as client:
            resp = await client.get(
                f"{self.api_base_url}/item_summary/search",
                headers=headers,
                params=params,
            )
            resp.raise_for_status()
            data = resp.json()

        items = data.get("itemSummaries", [])
        normalized: List[ExternalProductDTO] = []

        for item in items:
            price_val = float(item.get("price", {}).get("value", 0.0))
            image_obj = item.get("image", {})
            image_url = image_obj.get("imageUrl", "")
            if not image_url:
                continue

            category_name = item.get("categories", [{}])[0].get("categoryName", "General")
            category_slug = category_name.lower().replace(" ", "-")

            normalized.append(
                ExternalProductDTO(
                    external_id=str(item.get("itemId")),
                    source=self.get_provider_name(),
                    title=item.get("title", ""),
                    description=item.get("shortDescription") or item.get("title", ""),
                    price=price_val,
                    category_name=category_name,
                    category_slug=category_slug,
                    brand_name=item.get("brand", "Verified Manufacturer"),
                    brand_slug=(item.get("brand") or "verified").lower().replace(" ", "-"),
                    image_url=image_url,
                    thumbnail_url=item.get("thumbnailImages", [{}])[0].get("imageUrl"),
                    raw_metadata=item,
                )
            )

        return normalized
