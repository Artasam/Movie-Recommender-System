"""V1 API router — aggregates all endpoint routers under /api/v1."""

from fastapi import APIRouter

from app.api.v1.endpoints import movies, recommend

api_v1_router = APIRouter()
api_v1_router.include_router(movies.router)
api_v1_router.include_router(recommend.router)
