"""
Repository for managing User data persistence.
"""
from typing import Optional, List
from user import User


class UserRepository:
    """
    Repository for managing User data persistence.
    Uses in-memory storage for demonstration purposes.
    """

    def __init__(self):
        self._database: dict[int, User] = {}
        self._id_counter: int = 1

    def save(self, user: User) -> User:
        """
        Save a user to the database.
        If the user has an ID, it updates; otherwise creates a new user.
        """
        if user.id is None:
            user.id = self._id_counter
            self._id_counter += 1

        self._database[user.id] = user
        return user

    def find_by_id(self, user_id: int) -> Optional[User]:
        """Find a user by their ID."""
        return self._database.get(user_id)

    def find_by_username(self, username: str) -> Optional[User]:
        """Find a user by their username."""
        for user in self._database.values():
            if user.username == username:
                return user
        return None

    def find_all_active(self) -> List[User]:
        """Find all active users."""
        return [user for user in self._database.values() if user.active]

    def delete_by_id(self, user_id: int) -> bool:
        """Delete a user by ID."""
        if user_id in self._database:
            del self._database[user_id]
            return True
        return False

    def count(self) -> int:
        """Get count of all users."""
        return len(self._database)
