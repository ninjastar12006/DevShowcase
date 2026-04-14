import json
from typing import Any, Optional

from redis import Redis
from redis.exceptions import RedisError

from config import REDIS_URL

redis_client = Redis.from_url(REDIS_URL, decode_response=True)

def get_json(key: str) -> Optional[Any]:
    try:
        value = redis_client.get(key)
        if value is None: return None 
        return json.loads(value)
    except (RedisError, json.JSONDecodeError): return None

def set_json(key: str, value: Any, ttl_seconds: int) -> bool:
    try:
        redis_client.setex(key, ttl_seconds, json.dumps(value))
        return True
    except (RedisError, TypeError): return False

def delete_key(key: str) -> None:
    try: redis_client.delete(key)
    except RedisError: pass