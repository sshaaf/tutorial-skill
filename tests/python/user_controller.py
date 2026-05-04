"""
REST API controller for user endpoints.
"""
from typing import Any, Dict, List
from dataclasses import dataclass
from user import User
from user_service import UserService


@dataclass
class Response:
    """HTTP response wrapper."""
    status: int
    message: str
    data: Any = None

    @classmethod
    def success(cls, data: Any) -> 'Response':
        """Create a success response."""
        return cls(status=200, message="Success", data=data)

    @classmethod
    def error(cls, status: int, message: str) -> 'Response':
        """Create an error response."""
        return cls(status=status, message=message, data=None)


class UserController:
    """
    REST API controller for user endpoints.
    Handles HTTP requests and delegates to UserService.
    """

    def __init__(self, user_service: UserService):
        self.user_service = user_service

    def register_user(self, request: Dict[str, str]) -> Response:
        """
        POST /api/users/register
        Register a new user.
        """
        try:
            user = self.user_service.register_user(
                username=request['username'],
                email=request['email'],
                password=request['password']
            )
            return Response.success(user.to_dict())
        except (ValueError, KeyError) as e:
            return Response.error(400, str(e))

    def login(self, request: Dict[str, str]) -> Response:
        """
        POST /api/users/login
        Authenticate a user.
        """
        try:
            user = self.user_service.authenticate(
                username=request['username'],
                password=request['password']
            )

            if user:
                return Response.success(user.to_dict())
            else:
                return Response.error(401, "Invalid credentials")
        except KeyError as e:
            return Response.error(400, f"Missing field: {e}")

    def get_user(self, user_id: int) -> Response:
        """
        GET /api/users/{id}
        Get user by ID.
        """
        user = self.user_service.get_user_by_id(user_id)

        if user:
            return Response.success(user.to_dict())
        else:
            return Response.error(404, "User not found")

    def get_all_users(self) -> Response:
        """
        GET /api/users
        Get all active users.
        """
        users = self.user_service.get_all_active_users()
        user_dicts = [user.to_dict() for user in users]
        return Response.success(user_dicts)

    def deactivate_user(self, user_id: int) -> Response:
        """
        DELETE /api/users/{id}
        Deactivate a user.
        """
        success = self.user_service.deactivate_user(user_id)

        if success:
            return Response.success("User deactivated")
        else:
            return Response.error(404, "User not found")
