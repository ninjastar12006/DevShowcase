from typing import Any, Dict, List, Optional

from pydantic import BaseModel


class GitHubRepoRead(BaseModel):
    repo_id: int
    name: str
    full_name: str
    html_url: str
    description: Optional[str] = None
    private: bool = False
    fork: bool = False
    archived: bool = False
    language: Optional[str] = None
    homepage: Optional[str] = None
    default_branch: Optional[str] = None
    topics: List[str] = []
    stars: int = 0
    forks: int = 0
    open_issues: int = 0
    pushed_at: Optional[str] = None
    synced_at: Optional[str] = None


class GitHubConnectionStatus(BaseModel):
    connected: bool
    github_login: Optional[str] = None
    github_user_id: Optional[str] = None
    avatar_url: Optional[str] = None
    last_synced_at: Optional[str] = None
    repository_count: int = 0


class GitHubImportSelectedRequest(BaseModel):
    repo_ids: List[int]


class GitHubOAuthCallbackResponse(BaseModel):
    success: bool
    message: str
    github_login: Optional[str] = None


class GitHubSyncResponse(BaseModel):
    success: bool
    repository_count: int = 0
    imported_count: int = 0
    repositories: List[Dict[str, Any]] = []
    portfolio: Optional[Dict[str, Any]] = None
