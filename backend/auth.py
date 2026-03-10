import httpx
from fastapi import HTTPException, Request, Header
from clerk_backend_api import Clerk
from clerk_backend_api.security.types import AuthenticateRequestOptions
from config import CLERK_SECRET_KEY, FRONTEND_URL

def _to_httpx_request(request: Request) -> httpx.Request:
    return httpx.Request(
        method=request.method,
        url=str(request.url),
        headers=dict(request.headers),
    )

async def get_current_user(request: Request, authorization: str = Header(None)):
    """
    Verifies the user session. 
    Matches the Bearer Token sent from the frontend BuildPage.jsx.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")

    clerk = Clerk(bearer_auth=CLERK_SECRET_KEY)
    httpx_request = _to_httpx_request(request)
    
    # Authenticate the request using Clerk's SDK
    request_state = clerk.authenticate_request(
        httpx_request,
        AuthenticateRequestOptions(
            authorized_parties=[FRONTEND_URL]
        ),
    )

    if not request_state.is_signed_in:
        reason = getattr(request_state, "reason", "Unauthorized")
        raise HTTPException(status_code=401, detail=str(reason))
    
    payload = getattr(request_state, "payload", None)
    return {
        "is_signed_in": True,
        "payload": payload,
        "message": "Backend successfully verified the Clerk token!"
    }