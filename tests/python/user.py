"""
User model representing a user account in the system.
"""
from dataclasses import dataclass, field
from typing import Optional


@dataclass
class User:
    """
    Represents a user in the system.
    This is the core entity that holds user account information.
    """
    username: str
    email: str
    id: Optional[int] = None
    password: Optional[str] = None
    active: bool = True

    def __repr__(self) -> str:
        return f"User(id={self.id}, username='{self.username}', email='{self.email}', active={self.active})"

    def to_dict(self) -> dict:
        """Convert user to dictionary (excluding password)."""
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'active': self.active
        }
