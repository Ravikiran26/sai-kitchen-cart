"""
Shim module: expose the real FastAPI app from the `srisaikitchen_api` package.

This keeps `uvicorn backend.main:app` working while the actual API implementation
lives in `srisaikitchen_api/main.py` (which is complete and tested).
"""

from srisaikitchen_api.main import app  # re-export the app

__all__ = ["app"]


