from datetime import datetime, timezone

from mongoengine import (
    BooleanField,
    DateTimeField,
    Document,
    IntField,
    ListField,
    StringField,
)


class RepositoryCache(Document):
    clerk_id = StringField(required=True)
    repo_id = IntField(required=True)
    name = StringField(required=True)
    full_name = StringField(required=True)
    html_url = StringField(required=True)
    description = StringField()
    private = BooleanField(default=False)
    fork = BooleanField(default=False)
    archived = BooleanField(default=False)
    language = StringField()
    homepage = StringField()
    default_branch = StringField()
    topics = ListField(StringField())
    stars = IntField(default=0)
    forks = IntField(default=0)
    open_issues = IntField(default=0)
    pushed_at = DateTimeField()
    synced_at = DateTimeField(default=lambda: datetime.now(timezone.utc))

    meta = {
        "indexes": [
            {
                "fields": ["clerk_id", "repo_id"],
                "unique": True,
            }
        ]
    }
