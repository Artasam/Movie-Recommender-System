"""Movie listing, search, and detail endpoints."""

from fastapi import APIRouter, Depends, HTTPException, Query

from app.api.deps import get_recommender
from app.schemas.movie import MovieBase, MovieSearchResult
from app.schemas.response import ApiResponse
from app.services.recommender import RecommenderService
from app.services.tmdb import tmdb_service

router = APIRouter(prefix="/movies", tags=["Movies"])


@router.get(
    "",
    response_model=ApiResponse[MovieSearchResult],
    summary="List all movies (paginated)",
)
async def list_movies(
    page: int = Query(default=1, ge=1, description="Page number"),
    limit: int = Query(default=20, ge=1, le=100, description="Items per page"),
    recommender: RecommenderService = Depends(get_recommender),
) -> ApiResponse[MovieSearchResult]:
    """Return a paginated list of all movies in the database."""
    movies, total = recommender.get_all_movies(page=page, limit=limit)
    return ApiResponse(
        data=MovieSearchResult(movies=movies, total=total),
        message=f"Page {page} — {len(movies)} of {total} movies",
    )


@router.get(
    "/search",
    response_model=ApiResponse[MovieSearchResult],
    summary="Search movies by title",
)
async def search_movies(
    q: str = Query(..., min_length=1, description="Search query (title substring)"),
    limit: int = Query(default=10, ge=1, le=50, description="Max results"),
    recommender: RecommenderService = Depends(get_recommender),
) -> ApiResponse[MovieSearchResult]:
    """Search movies by title. Results are ranked: exact → prefix → contains."""
    results = recommender.search_movies(query=q, limit=limit)
    return ApiResponse(
        data=MovieSearchResult(movies=results, total=len(results)),
        message=f"Found {len(results)} movies matching '{q}'",
    )


@router.get(
    "/{movie_id}",
    response_model=ApiResponse[MovieBase],
    summary="Get a single movie by ID",
)
async def get_movie(
    movie_id: int,
    recommender: RecommenderService = Depends(get_recommender),
) -> ApiResponse[MovieBase]:
    """Look up a movie by its TMDB movie_id."""
    movie = recommender.get_movie_by_id(movie_id)
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    return ApiResponse(data=movie)


@router.get(
    "/{movie_id}/poster",
    response_model=ApiResponse[dict],
    summary="Get poster URL for a movie",
)
async def get_movie_poster(movie_id: int) -> ApiResponse[dict]:
    """Fetch the poster URL from TMDB for a given movie ID."""
    poster_url = await tmdb_service.fetch_poster_url(movie_id)
    return ApiResponse(
        data={"movie_id": movie_id, "poster_url": poster_url},
        message="Poster fetched" if poster_url else "No poster available",
    )
