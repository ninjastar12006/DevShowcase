from datetime import datetime, timezone
from typing import Any, Dict, Iterable, List

import json

from models.github_connection import GitHubConnection
from models.portfolio import Portfolio
from models.repository_cache import RepositoryCache
from services.github_oauth_service import fetch_user_repositories
from services.token_crypto import decrypt_token


def _parse_datetime(value: Any):
    if not value:
        return None
    if isinstance(value, datetime):
        return value
    if isinstance(value, str):
        cleaned_value = value.replace("Z", "+00:00")
        return datetime.fromisoformat(cleaned_value)
    return None


def _repo_to_document(clerk_id: str, repo: Dict[str, Any]) -> RepositoryCache:
    return RepositoryCache(
        clerk_id=clerk_id,
        repo_id=int(repo["id"]),
        name=repo.get("name", ""),
        full_name=repo.get("full_name", repo.get("name", "")),
        html_url=repo.get("html_url", ""),
        description=repo.get("description") or "",
        private=bool(repo.get("private", False)),
        fork=bool(repo.get("fork", False)),
        archived=bool(repo.get("archived", False)),
        language=repo.get("language") or "",
        homepage=repo.get("homepage") or "",
        default_branch=repo.get("default_branch") or "",
        topics=list(repo.get("topics") or []),
        stars=int(repo.get("stargazers_count") or 0),
        forks=int(repo.get("forks_count") or 0),
        open_issues=int(repo.get("open_issues_count") or 0),
        pushed_at=_parse_datetime(repo.get("pushed_at")),
        synced_at=datetime.now(timezone.utc),
    )


def _document_to_dict(document: RepositoryCache) -> Dict[str, Any]:
    return {
        "repo_id": document.repo_id,
        "name": document.name,
        "full_name": document.full_name,
        "html_url": document.html_url,
        "description": document.description,
        "private": document.private,
        "fork": document.fork,
        "archived": document.archived,
        "language": document.language,
        "homepage": document.homepage,
        "default_branch": document.default_branch,
        "topics": document.topics,
        "stars": document.stars,
        "forks": document.forks,
        "open_issues": document.open_issues,
        "pushed_at": document.pushed_at.isoformat() if document.pushed_at else None,
        "synced_at": document.synced_at.isoformat() if document.synced_at else None,
    }


async def sync_github_repositories(clerk_id: str) -> List[Dict[str, Any]]:
    connection = GitHubConnection.objects(clerk_id=clerk_id).first()
    if not connection:
        raise ValueError("GitHub is not connected for this user")

    access_token = decrypt_token(connection.access_token_encrypted)
    repositories = await fetch_user_repositories(access_token)

    RepositoryCache.objects(clerk_id=clerk_id).delete()
    for repo in repositories:
        _repo_to_document(clerk_id, repo).save()

    connection.updated_at = datetime.now(timezone.utc)
    connection.save()

    return repositories


def list_cached_repositories(clerk_id: str) -> List[Dict[str, Any]]:
    cached_repositories = RepositoryCache.objects(clerk_id=clerk_id).order_by("-stars", "name")
    return [_document_to_dict(repo) for repo in cached_repositories]


def get_connection_status(clerk_id: str) -> Dict[str, Any]:
    connection = GitHubConnection.objects(clerk_id=clerk_id).first()
    if not connection:
        return {
            "connected": False,
            "github_login": None,
            "github_user_id": None,
            "avatar_url": None,
            "last_synced_at": None,
            "repository_count": 0,
        }

    repository_count = RepositoryCache.objects(clerk_id=clerk_id).count()
    latest_repo = RepositoryCache.objects(clerk_id=clerk_id).order_by("-synced_at").first()

    return {
        "connected": True,
        "github_login": connection.github_login,
        "github_user_id": connection.github_user_id,
        "avatar_url": connection.avatar_url,
        "last_synced_at": latest_repo.synced_at.isoformat() if latest_repo and latest_repo.synced_at else None,
        "repository_count": repository_count,
    }


def import_selected_repositories(clerk_id: str, repo_ids: Iterable[int]) -> Dict[str, Any]:
    portfolio = Portfolio.objects(clerk_id=clerk_id).first()
    if not portfolio:
        portfolio = Portfolio(clerk_id=clerk_id)

    repo_id_list = [int(repo_id) for repo_id in repo_ids]
    selected_repositories = RepositoryCache.objects(clerk_id=clerk_id, repo_id__in=repo_id_list)
    selected_repo_map = {repo.repo_id: repo for repo in selected_repositories}
    existing_projects = list(portfolio.projects or [])
    existing_repo_ids = {
        int(project.get("repoId"))
        for project in existing_projects
        if isinstance(project, dict) and project.get("repoId") is not None
    }

    imported_count = 0
    for repo_id in repo_id_list:
        repo = selected_repo_map.get(int(repo_id))
        if not repo or repo.repo_id in existing_repo_ids:
            continue

        existing_projects.append(
            {
                "id": len(existing_projects) + 1,
                "title": repo.name,
                "description": repo.description or "",
                "githubUrl": repo.html_url,
                "liveUrl": repo.homepage or "",
                "technologies": ", ".join(filter(None, [repo.language, *repo.topics])),
                "source": "github",
                "repoId": repo.repo_id,
                "fullName": repo.full_name,
                "stars": repo.stars,
                "forks": repo.forks,
            }
        )
        imported_count += 1

    portfolio.projects = existing_projects
    portfolio.githubSync = {
        "lastImportedAt": datetime.now(timezone.utc).isoformat(),
        "importedCount": imported_count,
    }
    portfolio.save()

    return {
        "imported_count": imported_count,
        "portfolio": json.loads(portfolio.to_json()),
    }


def disconnect_github(clerk_id: str) -> None:
    GitHubConnection.objects(clerk_id=clerk_id).delete()
