from dotenv import load_dotenv
import os

load_dotenv()

CLERK_SECRET_KEY = os.getenv("CLERK_SECRET_KEY")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
MONGODB_URI = os.getenv("MONGODB_URI")
GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")
GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET")
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
GITHUB_REPO_CACHE_TTL_SECONDS = int(os.getenv("GITHUB_REPO_CACHE_TTL_SECONDS", "86400"))
GITHUB_OAUTH_REDIRECT_URI = os.getenv(
    "GITHUB_OAUTH_REDIRECT_URI",
    "http://localhost:8080/auth/github/callback",
)
FRONTEND_GITHUB_CALLBACK_URL = os.getenv(
    "FRONTEND_GITHUB_CALLBACK_URL",
    "http://localhost:5173/oauth/github/callback",
)
GITHUB_SCOPES = os.getenv("GITHUB_SCOPES", "read:user repo").split()
GITHUB_STATE_SECRET = os.getenv("GITHUB_STATE_SECRET", CLERK_SECRET_KEY or "")
TOKEN_ENCRYPTION_SECRET = os.getenv("TOKEN_ENCRYPTION_SECRET", CLERK_SECRET_KEY or "")

if not CLERK_SECRET_KEY:
    raise ValueError("CLERK_SECRET_KEY is not set in .env")