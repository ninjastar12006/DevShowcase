import base64
import hashlib

from cryptography.fernet import Fernet

from config import TOKEN_ENCRYPTION_SECRET


def _build_fernet() -> Fernet:
    if not TOKEN_ENCRYPTION_SECRET:
        raise RuntimeError("TOKEN_ENCRYPTION_SECRET is not configured")

    digest = hashlib.sha256(TOKEN_ENCRYPTION_SECRET.encode("utf-8")).digest()
    key = base64.urlsafe_b64encode(digest)
    return Fernet(key)


def encrypt_token(token: str) -> str:
    fernet = _build_fernet()
    return fernet.encrypt(token.encode("utf-8")).decode("utf-8")


def decrypt_token(encrypted_token: str) -> str:
    fernet = _build_fernet()
    return fernet.decrypt(encrypted_token.encode("utf-8")).decode("utf-8")
