"""Dependency injection helpers for API endpoints."""

from fastapi import Request

from app.services.recommender import RecommenderService


def get_recommender(request: Request) -> RecommenderService:
    """Retrieve the shared RecommenderService instance from app state.

    The service is created once during the lifespan startup event and
    stored in ``app.state.recommender``.
    """
    return request.app.state.recommender
