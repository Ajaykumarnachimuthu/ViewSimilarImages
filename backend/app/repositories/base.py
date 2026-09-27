"""
Base repository interface.
"""

from abc import ABC, abstractmethod
from typing import Generic, List, Optional, TypeVar

T = TypeVar("T")


class BaseRepository(ABC, Generic[T]):
    """Abstract base repository defining standard CRUD and query contracts."""

    @abstractmethod
    async def get_by_id(self, item_id: str) -> Optional[T]:
        """Fetch single record by its primary key."""
        pass

    @abstractmethod
    async def list_all(self) -> List[T]:
        """Fetch all records."""
        pass
