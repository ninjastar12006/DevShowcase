import base64
import hashlib
import hmac
import json
import secrets
from datetime import datetime, timezone
from typing import Any, Dict, List
from urllib.parse import urlencode

import httpx

from config import (
    GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET,
    GITHUB_OAUTH_REDIRECT_URI,
    GITHUB_SCOPES,
    GITHUB_STATE_SECRET,
)


_USED_STATE_NONCES: set[str] = set()
_STATE_TTL_SECONDS = 600
_GITHUB_API_BASE = "https://api.github.com"
_GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token"
_GITHUB_AUTHORIZE_URL = "https://github.com/login/oauth/authorize"


def _state_secret() -> str:
    return GITHUB_STATE_SECRET or GITHUB_CLIENT_SECRET or "devshowcase-state-secret"


def create_oauth_state(clerk_id: str) -> str:
    nonce = secrets.token_urlsafe(16)
    payload = {
        "clerk_id": clerk_id,
        "nonce": nonce,
        "issued_at": int(datetime.now(timezone.utc).timestamp()),
    }
    payload_json = json.dumps(payload, separators=(",", ":"), sort_keys=True).encode("utf-8")
    encoded_payload = base64.urlsafe_b64encode(payload_json).decode("utf-8")
    signature = hmac.new(_state_secret().encode("utf-8"), encoded_payload.encode("utf-8"), hashlib.sha256).hexdigest()
    return f"{encoded_payload}.{signature}"


def validate_oauth_state(state: str) -> Dict[str, Any]:
    try:
        encoded_payload, signature = state.split(".", 1)
        expected_signature = hmac.new(
            _state_secret().encode("utf-8"),
            encoded_payload.encode("utf-8"),
            hashlib.sha256,
        ).hexdigest()
        if not hmac.compare_digest(signature, expected_signature):
            raise ValueError("Invalid OAuth state signature")

        payload_json = base64.urlsafe_b64decode(encoded_payload.encode("utf-8"))
        payload = json.loads(payload_json.decode("utf-8"))
        issued_at = int(payload["issued_at"])
        if int(datetime.now(timezone.utc).timestamp()) - issued_at > _STATE_TTL_SECONDS:
            raise ValueError("OAuth state expired")

        nonce = payload["nonce"]
        if nonce in _USED_STATE_NONCES:
            raise ValueError("OAuth state already used")
        _USED_STATE_NONCES.add(nonce)
        return payload
    except Exception as exc:
        raise ValueError(str(exc)) from exc


def build_authorize_url(state: str) -> str:
    if not GITHUB_CLIENT_ID or not GITHUB_OAUTH_REDIRECT_URI:
        raise RuntimeError("GitHub OAuth client settings are missing")

    query_string = urlencode(
        {
            "client_id": GITHUB_CLIENT_ID,
            "redirect_uri": GITHUB_OAUTH_REDIRECT_URI,
            "scope": " ".join(GITHUB_SCOPES),
            "state": state,
            "allow_signup": "true",
        }
    )
    return f"{_GITHUB_AUTHORIZE_URL}?{query_string}"


async def exchange_code_for_token(code: str) -> Dict[str, Any]:
    if not GITHUB_CLIENT_ID or not GITHUB_CLIENT_SECRET:
        raise RuntimeError("GitHub OAuth client settings are missing")

    async with httpx.AsyncClient(timeout=20) as client:
        response = await client.post(
            _GITHUB_TOKEN_URL,
            headers={"Accept": "application/json"},
            data={
                "client_id": GITHUB_CLIENT_ID,
                "client_secret": GITHUB_CLIENT_SECRET,
                "code": code,
                "redirect_uri": GITHUB_OAUTH_REDIRECT_URI,
            },
        )
        response.raise_for_status()
        payload = response.json()
        access_token = payload.get("access_token")
        if not access_token:
            raise RuntimeError(payload.get("error_description") or "Missing GitHub access token")
        return {
            "access_token": access_token,
            "scope": payload.get("scope", ""),
            "token_type": payload.get("token_type", ""),
        }


async def fetch_github_user(access_token: str) -> Dict[str, Any]:
    async with httpx.AsyncClient(timeout=20) as client:
        response = await client.get(
            f"{_GITHUB_API_BASE}/user",
            headers={
                "Authorization": f"Bearer {access_token}",
                "Accept": "application/vnd.github+json",
                "X-GitHub-Api-Version": "2022-11-28",
            },
        )
        response.raise_for_status()
        return response.json()


async def fetch_user_repositories(access_token: str) -> List[Dict[str, Any]]:
    repositories: List[Dict[str, Any]] = []
    page = 1

    async with httpx.AsyncClient(timeout=20) as client:
        while True:
            response = await client.get(
                f"{_GITHUB_API_BASE}/user/repos",
                params={
                    "per_page": 100,
                    "page": page,
                    "sort": "updated",
                    "affiliation": "owner,collaborator,organization_member",
                },
                headers={
                    "Authorization": f"Bearer {access_token}",
                    "Accept": "application/vnd.github+json",
                    "X-GitHub-Api-Version": "2022-11-28",
                },
            )
            response.raise_for_status()
            page_items = response.json()
            if not page_items:
                break
            repositories.extend(page_items)
            if len(page_items) < 100:
                break
            page += 1

    return repositories
