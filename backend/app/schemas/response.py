"""Standardized API response envelope."""

from typing import Any, Generic, TypeVar

from pydantic import BaseModel

T = TypeVar("T")


class ApiResponse(BaseModel, Generic[T]):
    """Every endpoint returns this envelope for consistent client handling."""

    success: bool = True
    data: T | None = None
    message: str = "OK"
    errors: Any = None
