"""
Pytest test fixtures and sample data generators.
"""

import io
import pytest
from httpx import ASGITransport, AsyncClient
from PIL import Image
from backend.app.main import app


@pytest.fixture
def sample_jpeg_bytes() -> bytes:
    """Generate a valid synthetic 100x100 RGB JPEG image."""
    img = Image.new("RGB", (100, 100), color=(220, 38, 38))  # Crimson red
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    return buf.getvalue()


@pytest.fixture
def sample_png_bytes() -> bytes:
    """Generate a valid synthetic 80x80 RGB PNG image."""
    img = Image.new("RGB", (80, 80), color=(255, 255, 255))  # White
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


@pytest.fixture
def fake_corrupt_bytes() -> bytes:
    """Bytes with a fake header or corrupted content."""
    return b"\xff\xd8\xff\xe0" + b"random_corrupted_payload_that_is_not_an_image"


@pytest.fixture
async def async_client():
    """Async HTTP test client against FastAPI ASGI app."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://testserver") as client:
        yield client
