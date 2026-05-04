"""
Service layer for user business logic.
"""
import re
from typing import Optional, List
from user import User
from user_repository import UserRepository
from password_encoder import PasswordEncoder


class UserService:
    """
    Service layer for user business logic.
    Handles validation, password hashing, and business rules.
    """

    def __init__(self, user_repository: UserRepository, password_encoder: PasswordEncoder):
        self.user_repository = user_repository
        self.password_encoder = password_encoder

    def register_user(self, username: str, email: str, password: str) -> User:
        """Register a new user with validation."""
        # Validate username is unique
        if self.user_repository.find_by_username(username):
            raise ValueError(f"Username already exists: {username}")

        # Validate email format
        if not self._is_valid_email(email):
            raise ValueError(f"Invalid email format: {email}")

        # Create and save user
        user = User(username=username, email=email)
        user.password = self.password_encoder.encode(password)
        return self.user_repository.save(user)

    def authenticate(self, username: str, password: str) -> Optional[User]:
        """Authenticate a user with username and password."""
        user = self.user_repository.find_by_username(username)

        if user and user.active and self.password_encoder.matches(password, user.password):
            return user
        return None

    def get_user_by_id(self, user_id: int) -> Optional[User]:
        """Get a user by ID."""
        return self.user_repository.find_by_id(user_id)

    def get_all_active_users(self) -> List[User]:
        """Get all active users."""
        return self.user_repository.find_all_active()

    def deactivate_user(self, user_id: int) -> bool:
        """Deactivate a user account (soft delete)."""
        user = self.user_repository.find_by_id(user_id)
        if user:
            user.active = False
            self.user_repository.save(user)
            return True
        return False

    def update_email(self, user_id: int, new_email: str) -> User:
        """Update user email."""
        user = self.user_repository.find_by_id(user_id)
        if not user:
            raise ValueError(f"User not found: {user_id}")

        if not self._is_valid_email(new_email):
            raise ValueError(f"Invalid email format: {new_email}")

        user.email = new_email
        return self.user_repository.save(user)

    @staticmethod
    def _is_valid_email(email: str) -> bool:
        """Validate email format."""
        pattern = r'^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$'
        return bool(re.match(pattern, email))
