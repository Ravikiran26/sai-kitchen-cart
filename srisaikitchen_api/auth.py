import os
from typing import Optional
import requests
from fastapi import HTTPException, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

SUPABASE_URL = os.getenv("SUPABASE_URL") or os.getenv("VITE_SUPABASE_URL")
SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

security = HTTPBearer(auto_error=False)


def _get_user_from_token(token: str) -> Optional[dict]:
    """Validate the provided Supabase access token by calling Supabase auth user endpoint.
    This ensures the token is valid and returns the user object.
    """
    if not SUPABASE_URL:
        raise RuntimeError("SUPABASE_URL is not configured in the environment")

    try:
        r = requests.get(f"{SUPABASE_URL}/auth/v1/user", headers={"Authorization": f"Bearer {token}"}, timeout=5)
    except Exception:
        return None

    if r.status_code != 200:
        return None

    return r.json()


def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security)) -> dict:
    if not credentials or not credentials.credentials:
        raise HTTPException(status_code=401, detail="Missing Authorization Bearer token")

    token = credentials.credentials
    user = _get_user_from_token(token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    # basic user info returned by Supabase: id, email, etc.
    return user


def admin_required(credentials: HTTPAuthorizationCredentials = Security(security)) -> dict:
    """Dependency that ensures the caller is an admin as defined in Supabase `user_roles`.
    The function will validate the token and then query the `user_roles` table using the
    service role key configured in `SUPABASE_SERVICE_ROLE_KEY`.
    """
    user = get_current_user(credentials)
    user_id = user.get("id")

    if not SERVICE_ROLE_KEY:
        raise HTTPException(status_code=500, detail="Server misconfiguration: SUPABASE_SERVICE_ROLE_KEY missing")

    # Query the user_roles table via Supabase REST API using the service role key
    try:
        r = requests.get(
            f"{SUPABASE_URL}/rest/v1/user_roles?user_id=eq.{user_id}&select=role",
            headers={
                "apikey": SERVICE_ROLE_KEY,
                "Authorization": f"Bearer {SERVICE_ROLE_KEY}",
            },
            timeout=5,
        )
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to verify user role")

    if r.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to verify user role")

    roles = r.json()
    is_admin = any((r.get("role") == "admin") for r in roles)
    if not is_admin:
        raise HTTPException(status_code=403, detail="Admin privileges required")

    return user
