"""TMDB API service for fetching movie poster URLs."""

import httpx

from app.core.config import settings


class TMDBService:
    """Async client for The Movie Database API v3."""

    def __init__(self) -> None:
        self.api_key = settings.TMDB_API_KEY
        self.base_url = settings.TMDB_BASE_URL
        self.image_base = settings.TMDB_IMAGE_BASE_URL

    async def fetch_poster_url(self, movie_id: int) -> str | None:
        """Fetch the poster image URL for a given TMDB movie ID.

        Returns None if the API key is missing, the request fails,
        or the movie has no poster.
        """
        if not self.api_key:
            return None

        url = f"{self.base_url}/movie/{movie_id}"
        params = {"api_key": self.api_key, "language": "en-US"}

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(url, params=params)
                if response.status_code == 200:
                    data = response.json()
                    poster_path = data.get("poster_path")
                    if poster_path:
                        return f"{self.image_base}{poster_path}"
        except (httpx.RequestError, httpx.TimeoutException):
            # Silently fail — posters are non-critical
            pass

        return None

    async def fetch_movie_details(self, movie_id: int) -> dict | None:
        """Fetch full movie details from TMDB (overview, rating, etc.)."""
        if not self.api_key:
            return None

        url = f"{self.base_url}/movie/{movie_id}"
        params = {"api_key": self.api_key, "language": "en-US"}

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(url, params=params)
                if response.status_code == 200:
                    return response.json()
        except (httpx.RequestError, httpx.TimeoutException):
            pass

        return None


tmdb_service = TMDBService()
