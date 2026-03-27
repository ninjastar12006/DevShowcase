from pydantic import BaseModel
from typing import List, Dict, Optional

class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None
    members: Optional[List[str]] = []  # list of user IDs

class ProjectRead(BaseModel):
    id: str
    name: str
    description: Optional[str]
    members: List[str]

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    members: Optional[List[str]] = None

class PortfolioBuildSchema(BaseModel):
    email: Optional[str] = ""      
    username: Optional[str] = ""   
    template: Optional[str] = "The Minimalist"
    primaryColor: Optional[str] = ""
    secondaryColor: Optional[str] = ""
    about: Optional[Dict] = {}
    projects: Optional[List[Dict]] = []
    involvement: Optional[Dict] = {}