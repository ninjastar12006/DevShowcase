from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, Body, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import RedirectResponse
from mongoengine import connect, disconnect
import json
from urllib.parse import quote
import time
from fastapi import Request

from auth import get_current_user
from config import FRONTEND_GITHUB_CALLBACK_URL, MONGODB_URI, FRONTEND_URL
from models.usermodel import User
from models.portfolio import Portfolio
from models.github_connection import GitHubConnection
from schemas.projectschema import PortfolioBuildSchema
from schemas.githubschema import (
    GitHubConnectionStatus,
    GitHubImportSelectedRequest,
    GitHubSyncResponse,
)
from services.github_oauth_service import (
    build_authorize_url,
    create_oauth_state,
    exchange_code_for_token,
    fetch_github_user,
    validate_oauth_state,
)
from services.github_sync_service import (
    disconnect_github,
    get_connection_status,
    import_selected_repositories,
    list_cached_repositories,
    sync_github_repositories,
)
from services.token_crypto import encrypt_token

security = HTTPBearer()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Connect to MongoDB Atlas before the app starts
    try:
        connect(host=MONGODB_URI)
        print("--- Successfully connected to MongoDB Atlas ---")
    except Exception as e:
        print(f"--- Connection Failed: {e} ---")
    
    yield  # The application serves requests here
    
    # Disconnect when the server stops
    disconnect()
    print("--- Successfully disconnected from MongoDB ---")

app = FastAPI(lifespan=lifespan)

# CORS configuration to allow requests from the Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "https://devshowcase-frontend-one.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "DevShowcase backend is running"}

@app.get("/health")
def health():
    return {"ok": True}

@app.get("/auth-timing")
async def auth_timing(request: Request, user=Depends(get_current_user)):
    return {"ok": True, "user_sub": user["payload"].get("sub")}

@app.get("/protected")
async def protected_route(user=Depends(get_current_user)):
    return {
        "message": "You reached a protected route",
        "user": user,
    }

# POST route to receive and store portfolio builds in MongoDB Atlas
@app.post("/save-portfolio")
async def save_portfolio(
    build_data: PortfolioBuildSchema,
    user=Depends(get_current_user),
    token: HTTPAuthorizationCredentials = Depends(security)
):
    clerk_id = user['payload']['sub']
    
    # 1. Check if this user already has a saved portfolio
    portfolio = Portfolio.objects(clerk_id=clerk_id).first()
    
    # 2. If not, create a new empty one tied to their ID
    if not portfolio:
        portfolio = Portfolio(clerk_id=clerk_id)
        
    # 3. Update the portfolio with the incoming data (Including new user info)
    portfolio.email = build_data.email
    portfolio.username = build_data.username

    portfolio.published_portfolio = portfolio.published_portfolio or {}
    
    portfolio.template = build_data.template
    portfolio.primaryColor = build_data.primaryColor
    portfolio.secondaryColor = build_data.secondaryColor
    portfolio.about = build_data.about
    portfolio.projects = build_data.projects
    portfolio.involvement = build_data.involvement
    
    # 4. Save to MongoDB Atlas
    portfolio.save()

    return {
        "message": "Portfolio build successfully stored in MongoDB Atlas!",
        "clerk_id": clerk_id,
        "database_id": str(portfolio.id)
    }

@app.post("/publish-portfolio")
async def publish_portfolio(
    user=Depends(get_current_user),
    token: HTTPAuthorizationCredentials = Depends(security)
):
    clerk_id = user["payload"]["sub"]

    portfolio = Portfolio.objects(clerk_id=clerk_id).first()
    if not portfolio:
        raise HTTPException(status_code=404, detail="No portfolio found for this user.")

    portfolio.published_portfolio = {
        "template": portfolio.template,
        "primaryColor": portfolio.primaryColor,
        "secondaryColor": portfolio.secondaryColor,
        "about": portfolio.about,
        "projects": portfolio.projects,
        "involvement": portfolio.involvement,
        "username": portfolio.username,
        "email": portfolio.email,
    }

    portfolio.save()

    return {"message": "Portfolio published successfully!"}

# GET route to send the saved portfolio back to the frontend on load
@app.get("/get-portfolio")
async def get_portfolio(
    user=Depends(get_current_user),
    token: HTTPAuthorizationCredentials = Depends(security)
):
    clerk_id = user['payload']['sub']
    
    portfolio = Portfolio.objects(clerk_id=clerk_id).first()
    if not portfolio:
        raise HTTPException(status_code=404, detail="No portfolio found for this user.")
        
    return json.loads(portfolio.to_json())


# --- NEW: PUBLIC RECRUITER ROUTE ---
@app.get("/api/public/portfolio/{username}")
async def get_public_portfolio(username: str):
    # Find the portfolio by the username
    portfolio = Portfolio.objects(username=username).first()
    
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")
        
    if not portfolio.published_portfolio:
        raise HTTPException(status_code=404, detail="No published portfolio found")

    return portfolio.published_portfolio


@app.get("/auth/github/start")
async def start_github_oauth(user=Depends(get_current_user)):
    clerk_id = user["payload"]["sub"]
    state = create_oauth_state(clerk_id)
    return {
        "authorize_url": build_authorize_url(state),
        "state": state,
    }


@app.get("/auth/github/callback")
async def github_oauth_callback(code: str = Query(...), state: str = Query(...)):
    try:
        state_payload = validate_oauth_state(state)
        clerk_id = state_payload["clerk_id"]
        token_payload = await exchange_code_for_token(code)
        access_token = token_payload["access_token"]
        github_user = await fetch_github_user(access_token)

        encrypted_token = encrypt_token(access_token)
        connection = GitHubConnection.objects(clerk_id=clerk_id).first()
        if not connection:
            connection = GitHubConnection(clerk_id=clerk_id)

        connection.github_user_id = str(github_user["id"])
        connection.github_login = github_user.get("login", "")
        connection.avatar_url = github_user.get("avatar_url", "")
        connection.access_token_encrypted = encrypted_token
        connection.token_scope = token_payload.get("scope", "")
        connection.save()

        redirect_url = f"{FRONTEND_GITHUB_CALLBACK_URL}?success=true&github_login={quote(connection.github_login)}"
        return RedirectResponse(url=redirect_url, status_code=302)
    except Exception as exc:
        redirect_url = f"{FRONTEND_GITHUB_CALLBACK_URL}?success=false&error={quote(str(exc))}"
        return RedirectResponse(url=redirect_url, status_code=302)


@app.get("/github/status", response_model=GitHubConnectionStatus)
async def github_status(user=Depends(get_current_user)):
    clerk_id = user["payload"]["sub"]
    return get_connection_status(clerk_id)


@app.get("/github/repositories", response_model=GitHubSyncResponse)
async def github_repositories(
    force_sync: bool = Query(False),
    user=Depends(get_current_user),
):
    clerk_id = user["payload"]["sub"]
    repositories = await sync_github_repositories(clerk_id, force_refresh=force_sync)
    return {
        "success": True,
        "repository_count": len(repositories),
        "repositories": repositories,
    }


@app.post("/github/sync", response_model=GitHubSyncResponse)
async def github_sync(user=Depends(get_current_user)):
    clerk_id = user["payload"]["sub"]
    repositories = await sync_github_repositories(clerk_id, force_refresh=True)
    return {
        "success": True,
        "repository_count": len(repositories),
        "repositories": repositories,
    }


@app.post("/github/import-selected")
async def github_import_selected(
    request: GitHubImportSelectedRequest,
    user=Depends(get_current_user),
):
    clerk_id = user["payload"]["sub"]
    result = import_selected_repositories(clerk_id, request.repo_ids)

    return {
        "success": True,
        "imported_count": result["imported_count"],
        "new_projects": result["new_projects"],
    }


@app.delete("/github/disconnect")
async def github_disconnect(user=Depends(get_current_user)):
    clerk_id = user["payload"]["sub"]
    disconnect_github(clerk_id)
    return {"success": True, "message": "GitHub disconnected successfully"}

# --- ADMIN DASHBOARD ROUTE ---
@app.get("/api/admin/dashboard")
async def get_admin_dashboard(user=Depends(get_current_user)):
    # 1. Verify this user is an admin via Clerk metadata
    metadata = user.get("payload", {}).get("public_metadata", {})
    if metadata.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Unauthorized. Admins only.")

    # 2. Gather platform statistics
    all_portfolios = Portfolio.objects()
    
    stats = {
        "total_users": all_portfolios.count(),
        "published_count": sum(1 for p in all_portfolios if p.published_portfolio),
        "classic_templates": sum(1 for p in all_portfolios if p.template == "classic"),
        "minimalist_templates": sum(1 for p in all_portfolios if p.template == "minimalist"),
        "technical_templates": sum(1 for p in all_portfolios if p.template == "technical"),
    }

    # 3. Get the latest 10 users for the data table
    recent_users = []
    for p in all_portfolios.order_by('-id').limit(10):
        recent_users.append({
            "id": str(p.id),
            "email": p.email or "Unknown",
            "username": p.username or "Unset",
            "template": p.template,
            "is_published": bool(p.published_portfolio)
        })

    return {"stats": stats, "recent_users": recent_users}