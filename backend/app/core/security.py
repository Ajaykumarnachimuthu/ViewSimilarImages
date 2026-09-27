"""
Security utilities and file upload validation.
"""

import io
import uuid
from typing import Tuple
from PIL import Image
from backend.app.core.config import settings
from backend.app.core.exceptions import (
    PayloadTooLargeError,
    SecurityValidationError,
)

# PIL Decompression Bomb mitigation: Limit image size to 10 Megapixels
Image.MAX_IMAGE_PIXELS = 10_000_000

# Magic bytes signatures for supported image formats
MAGIC_SIGNATURES = {
    "jpeg": [b"\xff\xd8\xff"],
    "png": [b"\x89PNG\r\n\x1a\n"],
    "webp": [b"RIFF"],  # Further checked for 'WEBP' at offset 8
}


def detect_image_format_from_bytes(data: bytes) -> str:
    """
    Detect the real image format from magic byte signatures.
    Does not trust client headers or filenames.
    """
    if len(data) < 12:
        raise SecurityValidationError("Image file is too small or truncated.")

    # Check JPEG
    if data.startswith(b"\xff\xd8\xff"):
        return "jpeg"

    # Check PNG
    if data.startswith(b"\x89PNG\r\n\x1a\n"):
        return "png"

    # Check WEBP: Starts with 'RIFF' and has 'WEBP' at index 8..12
    if data.startswith(b"RIFF") and data[8:12] == b"WEBP":
        return "webp"

    raise SecurityValidationError(
        "Unsupported or invalid image format. Allowed formats: JPEG, PNG, WEBP."
    )


def validate_image_upload(
    file_bytes: bytes,
    original_filename: str = "",
) -> Tuple[str, str]:
    """
    Comprehensive multi-stage security validation of untrusted file upload:
    1. Size limit enforcement
    2. Magic bytes signature verification
    3. Safe PIL decode & integrity verification
    4. Sanitized UUID safe filename generation

    Returns:
        Tuple[str, str]: (sanitized_safe_filename, detected_format)
    """
    actual_size = len(file_bytes)
    if actual_size > settings.MAX_UPLOAD_SIZE_BYTES:
        raise PayloadTooLargeError(
            max_bytes=settings.MAX_UPLOAD_SIZE_BYTES,
            actual_bytes=actual_size,
        )

    # 1. Magic bytes
    fmt = detect_image_format_from_bytes(file_bytes)

    # 2. Decode verification using PIL
    try:
        with Image.open(io.BytesIO(file_bytes)) as img:
            img.verify()
            # Dimensions check
            width, height = img.size
            if width <= 0 or height <= 0:
                raise SecurityValidationError("Image has invalid dimensions.")
    except Exception as exc:
        raise SecurityValidationError(
            f"Image corrupted or decompression failed: {str(exc)}"
        )

    # 3. Generate secure randomized filename
    safe_filename = f"{uuid.uuid4().hex}.{fmt}"

    return safe_filename, fmt
