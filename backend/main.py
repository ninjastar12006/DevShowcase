from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, Body, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from mongoengine import connect, disconnect
import json

from auth import get_current_user
from config import MONGODB_URI
from models.usermodel import User
from models.portfolio import Portfolio
from schemas.projectschema import PortfolioBuildSchema

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
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "DevShowcase backend is running"}

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