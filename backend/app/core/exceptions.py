"""
Custom application exceptions and centralized error models.
"""

from typing import Any, Optional
from fastapi import Request, status
from fastapi.responses import JSONResponse


class AppException(Exception):
    """Base class for all domain application exceptions."""

    def __init__(
        self,
        message: str,
        error_code: str = "INTERNAL_ERROR",
        status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR,
        details: Optional[Any] = None,
    ):
        self.message = message
        self.error_code = error_code
        self.status_code = status_code
        self.details = details
        super().__init__(message)


class EntityNotFoundError(AppException):
    """Raised when a requested resource cannot be found."""

    def __init__(self, entity_name: str, identifier: Any):
        super().__init__(
            message=f"{entity_name} with identifier '{identifier}' was not found.",
            error_code=f"{entity_name.upper()}_NOT_FOUND",
            status_code=status.HTTP_404_NOT_FOUND,
        )


class PayloadTooLargeError(AppException):
    """Raised when an uploaded file exceeds maximum size."""

    def __init__(self, max_bytes: int, actual_bytes: int):
        super().__init__(
            message=f"Uploaded file exceeds maximum limit of {max_bytes // (1024 * 1024)}MB.",
            error_code="PAYLOAD_TOO_LARGE",
            status_code=status.HTTP_413_CONTENT_TOO_LARGE,
            details={"max_bytes": max_bytes, "actual_bytes": actual_bytes},
        )


class SecurityValidationError(AppException):
    """Raised when an untrusted upload violates security policy."""

    def __init__(self, message: str, details: Optional[Any] = None):
        super().__init__(
            message=message,
            error_code="SECURITY_VALIDATION_FAILED",
            status_code=status.HTTP_400_BAD_REQUEST,
            details=details,
        )


class VisionProcessingError(AppException):
    """Raised when image decoding or computer vision feature extraction fails."""

    def __init__(self, message: str, details: Optional[Any] = None):
        super().__init__(
            message=message,
            error_code="VISION_PROCESSING_ERROR",
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            details=details,
        )


async def app_exception_handler(request: Request, exc: AppException) -> JSONResponse:
    """FastAPI handler to convert domain exceptions into structured JSON responses."""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.error_code,
            "message": exc.message,
            "details": exc.details,
            "path": request.url.path,
        },
    )


async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Fallback handler for unhandled server exceptions (prevents internal stack leakage)."""
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "INTERNAL_SERVER_ERROR",
            "message": "An unexpected error occurred while processing the request.",
            "path": request.url.path,
        },
    )
