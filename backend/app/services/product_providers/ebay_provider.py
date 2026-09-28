"""
eBay Browse API external product provider implementation.
Implements OAuth 2.0 Client Credentials grant, token refresh, and item discovery.
"""

import base64
import logging
import time
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
    Official eBay Browse API Provider.
    Ready for live production integration once EBAY_CLIENT_ID and EBAY_CLIENT_SECRET are supplied.
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
        self._token_expires_at: float = 0.0

        if self.environment == "PRODUCTION":
            self.auth_url = "https://api.ebay.com/identity/v1/oauth2/token"
            self.api_base_url = "https://api.ebay.com/buy/browse/v1"
        else:
            self.auth_url = "https://api.sandbox.ebay.com/identity/v1/oauth2/token"
            self.api_base_url = "https://api.sandbox.ebay.com/buy/browse/v1"

    def get_provider_name(self) -> str:
        return "ebay_browse_api"

    def is_configured(self) -> bool:
        """Check whether required eBay credentials are provided."""
        return bool(self.client_id and self.client_secret)

    async def _authenticate(self) -> str:
        """Obtain or refresh application access token using OAuth 2.0 Client Credentials."""
        if not self.is_configured():
            raise ValueError(
                "eBay provider implemented but credentials are not configured. "
                "Manual user configuration is required. "
                "Please set EBAY_CLIENT_ID and EBAY_CLIENT_SECRET in backend/.env."
            )

        # Re-use existing token if valid for at least 60 more seconds
        if self._access_token and time.time() < (self._token_expires_at - 60):
            return self._access_token

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

        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                resp = await client.post(self.auth_url, headers=headers, data=data)
                if resp.status_code == 401:
                    raise PermissionError("eBay OAuth authentication failed: Invalid Client ID or Client Secret.")
                resp.raise_for_status()
                payload = resp.json()
                self._access_token = payload.get("access_token")
                expires_in = float(payload.get("expires_in", 7200))
                self._token_expires_at = time.time() + expires_in
                logger.info("Successfully acquired eBay OAuth token (valid for %d seconds)", int(expires_in))
                return self._access_token
        except httpx.HTTPStatusError as exc:
            logger.error("eBay OAuth token request returned HTTP status %d: %s", exc.response.status_code, exc.response.text)
            raise
        except Exception as exc:
            logger.error("Failed to authenticate with eBay OAuth endpoint: %s", exc)
            raise

    async def fetch_products(self, limit: int = 50) -> List[ExternalProductDTO]:
        """Fetch items from eBay Browse API and normalize to ExternalProductDTO."""
        token = await self._authenticate()

        headers = {
            "Authorization": f"Bearer {token}",
            "X-EBAY-C-MARKETPLACE-ID": "EBAY_US",
        }
        params = {
            "q": "footwear outerwear electronics watches home",
            "limit": min(limit, 50),
        }

        try:
            async with httpx.AsyncClient(timeout=20.0) as client:
                resp = await client.get(
                    f"{self.api_base_url}/item_summary/search",
                    headers=headers,
                    params=params,
                )
                if resp.status_code == 429:
                    logger.warning("eBay Browse API rate limit reached (HTTP 429).")
                    raise RuntimeError("eBay API rate limit exceeded. Please back off before retrying.")
                if resp.status_code == 401:
                    # Clear expired token
                    self._access_token = None
                    self._token_expires_at = 0.0
                    raise PermissionError("eBay API token rejected (HTTP 401).")
                resp.raise_for_status()
                data = resp.json()
        except httpx.HTTPStatusError as exc:
            logger.error("eBay search request failed with status %d: %s", exc.response.status_code, exc.response.text)
            raise
        except Exception as exc:
            logger.error("Failed to query eBay Browse API: %s", exc)
            raise

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

        logger.info("Successfully fetched and normalized %d items from eBay Browse API", len(normalized))
        return normalized
