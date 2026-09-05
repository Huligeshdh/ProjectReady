import pytest
from app.core.security import hash_password, verify_password, create_access_token, decode_access_token


def test_password_hashing():
    """Verify SHA-256 HMAC password hashing and verification."""
    raw = "MySecurePassword123"
    hashed = hash_password(raw)

    assert hashed != raw
    assert verify_password(raw, hashed) is True
    assert verify_password("WrongPassword", hashed) is False


def test_jwt_token_generation_and_decoding():
    """Verify JWT access token creation and payload decoding."""
    user_id = 42
    token = create_access_token(user_id)
    assert isinstance(token, str)

    payload = decode_access_token(token)
    assert payload is not None
    assert payload.get("sub") == "42"
    assert "exp" in payload


def test_invalid_jwt_token_decoding():
    """Verify malformed or invalid JWT tokens return None safely."""
    invalid_token = "invalid.bearer.token.12345"
    payload = decode_access_token(invalid_token)
    assert payload is None
