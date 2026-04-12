from datetime import datetime, timezone

from mongoengine import DateTimeField, Document, StringField


class GitHubConnection(Document):
    clerk_id = StringField(required=True, unique=True)
    github_user_id = StringField(required=True)
    github_login = StringField(required=True)
    avatar_url = StringField()
    access_token_encrypted = StringField(required=True)
    token_scope = StringField()
    connected_at = DateTimeField(default=lambda: datetime.now(timezone.utc))
    updated_at = DateTimeField(default=lambda: datetime.now(timezone.utc))
