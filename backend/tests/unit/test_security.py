"""
Unit tests for upload security validation and magic byte inspection.
"""

import pytest
from backend.app.core.exceptions import PayloadTooLargeError, SecurityValidationError
from backend.app.core.security import (
    detect_image_format_from_bytes,
    validate_image_upload,
)


def test_detect_jpeg_magic_bytes(sample_jpeg_bytes):
    fmt = detect_image_format_from_bytes(sample_jpeg_bytes)
    assert fmt == "jpeg"


def test_detect_png_magic_bytes(sample_png_bytes):
    fmt = detect_image_format_from_bytes(sample_png_bytes)
    assert fmt == "png"


def test_reject_non_image_spoofed():
    fake_data = b"Hello, this is just a plain text file masquerading as image"
    with pytest.raises(SecurityValidationError) as exc:
        detect_image_format_from_bytes(fake_data)
    assert "Unsupported or invalid image format" in str(exc.value)


def test_validate_image_upload_success(sample_jpeg_bytes):
    filename, fmt = validate_image_upload(sample_jpeg_bytes, "test.jpg")
    assert fmt == "jpeg"
    assert filename.endswith(".jpeg")
    assert len(filename) > 30  # UUID hex length + extension


def test_validate_image_upload_corrupt_fails(fake_corrupt_bytes):
    with pytest.raises(SecurityValidationError):
        validate_image_upload(fake_corrupt_bytes, "corrupt.jpg")


def test_validate_image_oversized():
    # 6MB synthetic buffer
    huge_data = b"\xff\xd8\xff" + b"0" * (6 * 1024 * 1024)
    with pytest.raises(PayloadTooLargeError):
        validate_image_upload(huge_data, "large.jpg")
