"""Movie-related Pydantic v2 schemas for request/response validation."""

from pydantic import BaseModel, Field


class MovieBase(BaseModel):
    """Minimal movie representation used in lists and search results."""

    movie_id: int
    title: str


class MovieSearchResult(BaseModel):
    """Paginated list of movies returned by search and list endpoints."""

    movies: list[MovieBase]
    total: int


class RecommendRequest(BaseModel):
    """Request body for the recommendation endpoint."""

    movie_title: str = Field(
        ...,
        min_length=1,
        description="Exact title of the movie to get recommendations for",
    )
    count: int = Field(
        default=5,
        ge=1,
        le=20,
        description="Number of recommendations to return (1-20)",
    )


class RecommendedMovie(MovieBase):
    """A recommended movie with similarity score and poster URL."""

    poster_url: str | None = None
    similarity_score: float = Field(
        default=0.0,
        description="Cosine similarity score (0-1, higher = more similar)",
    )


class RecommendResponse(BaseModel):
    """Full recommendation response with source movie and results."""

    source_movie: MovieBase
    recommendations: list[RecommendedMovie]
