import httpx
from fastapi import HTTPException, Request
from clerk_backend_api import Clerk
from clerk_backend_api.security.types import AuthenticateRequestOptions

from config import CLERK_SECRET_KEY, FRONTEND_URL

def _to_httpx_request(request: Request) -> httpx.Request:
    return httpx.Request(
        method=request.method,
        url=str(request.url),
        headers=dict(request.headers),
    )

async def get_current_user(request: Request):
    clerk = Clerk(bearer_auth=CLERK_SECRET_KEY)

    httpx_request = _to_httpx_request(request)

    request_state = clerk.authenticate_request(
        httpx_request,
        AuthenticateRequestOptions(
            authorized_parties=[FRONTEND_URL]
        ),
    )

    if not request_state.is_signed_in:
        reason = getattr(request_state, "reason", "Unauthorized")
        raise HTTPException(status_code=401, detail = str(reason))
    
    payload = getattr(request_state, "payload", None)

    return {
        "is_signed_in": True,
        "payload": payload,
    }

# async def get_current_user(authorization: str = Header(default=None)):
#     if not authorization:
#         raise HTTPException(status_code=401, detail="Missing Authorization header")
    
#     # Bearer token = proof a user's logged in (authenticated)
#     if not authorization.startswith("Bearer "): 
#         raise HTTPException(status_code=401, detail="Invalid Authorization format")
    
#     token = authorization.split(" ", 1)[1].strip()

#     if not token:
#         raise HTTPException(status_code=401, detail="Missing bearer token")
    
#     # Temp Placeholder
#     # Later: where Clerk token/session verification will go
#     return {"token_received": True, "token_preview": token[:12]}