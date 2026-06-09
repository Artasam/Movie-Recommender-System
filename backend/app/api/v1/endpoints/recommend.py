"""Recommendation endpoint — the core feature of the application."""

import asyncio

from fastapi import APIRouter, Depends, HTTPException

from app.api.deps import get_recommender
from app.schemas.movie import RecommendRequest, RecommendResponse
from app.schemas.response import ApiResponse
from app.services.recommender import RecommenderService
from app.services.tmdb import tmdb_service

router = APIRouter(prefix="/recommend", tags=["Recommendations"])


@router.post(
    "",
    response_model=ApiResponse[RecommendResponse],
    summary="Get movie recommendations",
)
async def get_recommendations(
    body: RecommendRequest,
    recommender: RecommenderService = Depends(get_recommender),
) -> ApiResponse[RecommendResponse]:
    """Generate movie recommendations based on cosine similarity.

    Accepts a movie title and desired count, returns similar movies
    with poster URLs fetched concurrently from TMDB.
    """
    # Resolve the source movie
    results = recommender.search_movies(body.movie_title, limit=1)
    if not results:
        raise HTTPException(
            status_code=404,
            detail=f"Movie '{body.movie_title}' not found in database",
        )

    source_movie = results[0]

    # Generate recommendations from the similarity matrix
    recommendations = recommender.recommend(body.movie_title, count=body.count)
    if not recommendations:
        raise HTTPException(
            status_code=404,
            detail="Could not generate recommendations for this movie",
        )

    # Fetch all poster URLs concurrently (non-blocking)
    poster_tasks = [
        tmdb_service.fetch_poster_url(rec.movie_id) for rec in recommendations
    ]
    posters = await asyncio.gather(*poster_tasks)

    for rec, poster_url in zip(recommendations, posters):
        rec.poster_url = poster_url

    return ApiResponse(
        data=RecommendResponse(
            source_movie=source_movie,
            recommendations=recommendations,
        ),
        message=f"Found {len(recommendations)} recommendations for '{source_movie.title}'",
    )
