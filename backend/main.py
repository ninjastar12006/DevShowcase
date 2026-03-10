from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from auth import get_current_user

app = FastAPI()

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