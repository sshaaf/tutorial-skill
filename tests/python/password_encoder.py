"""
Utility for encoding and validating passwords.
"""
import hashlib
import base64


class PasswordEncoder:
    """
    Utility for encoding and validating passwords.
    Uses SHA-256 hashing for demonstration (use bcrypt in production).
    """

    @staticmethod
    def encode(plain_password: str) -> str:
        """Encode a plain text password."""
        hash_obj = hashlib.sha256(plain_password.encode())
        return base64.b64encode(hash_obj.digest()).decode()

    @staticmethod
    def matches(plain_password: str, encoded_password: str) -> bool:
        """Check if a plain password matches an encoded password."""
        encoded = PasswordEncoder.encode(plain_password)
        return encoded == encoded_password
