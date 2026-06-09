"""Movie recommendation engine using the pre-computed cosine similarity matrix.

This service wraps the ML artifacts (movies.pkl + similarity.pkl) produced
by the Jupyter notebook and exposes search, lookup, and recommendation
methods used by the API layer.
"""

from __future__ import annotations

import numpy as np
import pandas as pd

from app.schemas.movie import MovieBase, RecommendedMovie


class RecommenderService:
    """In-memory recommendation engine backed by a similarity matrix."""

    def __init__(self, movies: pd.DataFrame, similarity: np.ndarray) -> None:
        self.movies = movies
        self.similarity = similarity
        # Pre-build a lowercase title → DataFrame index lookup for O(1) access
        self._title_index: dict[str, int] = {
            title.lower(): idx
            for idx, title in enumerate(movies["title"].values)
        }

    # ── Search & Lookup ──────────────────────────────────────────

    def search_movies(self, query: str, limit: int = 10) -> list[MovieBase]:
        """Search movies by title substring. Prioritises exact → prefix → contains."""
        q = query.lower()
        exact: list[MovieBase] = []
        prefix: list[MovieBase] = []
        contains: list[MovieBase] = []

        for _, row in self.movies.iterrows():
            title_lower = row["title"].lower()
            entry = MovieBase(movie_id=int(row["movie_id"]), title=str(row["title"]))

            if title_lower == q:
                exact.append(entry)
            elif title_lower.startswith(q):
                prefix.append(entry)
            elif q in title_lower:
                contains.append(entry)

            # Early exit once we have enough candidates
            if len(exact) + len(prefix) + len(contains) >= limit * 3:
                break

        return (exact + prefix + contains)[:limit]

    def get_all_movies(
        self, page: int = 1, limit: int = 20
    ) -> tuple[list[MovieBase], int]:
        """Return a paginated slice of all movies."""
        total = len(self.movies)
        start = (page - 1) * limit
        end = min(start + limit, total)

        results = [
            MovieBase(movie_id=int(row["movie_id"]), title=str(row["title"]))
            for _, row in self.movies.iloc[start:end].iterrows()
        ]
        return results, total

    def get_movie_by_id(self, movie_id: int) -> MovieBase | None:
        """Look up a single movie by its TMDB movie_id."""
        match = self.movies[self.movies["movie_id"] == movie_id]
        if match.empty:
            return None
        row = match.iloc[0]
        return MovieBase(movie_id=int(row["movie_id"]), title=str(row["title"]))

    # ── Recommendations ──────────────────────────────────────────

    def recommend(self, movie_title: str, count: int = 5) -> list[RecommendedMovie]:
        """Return the top-N most similar movies based on cosine similarity.

        The similarity matrix was pre-computed from TF-IDF vectors of combined
        movie tags (genres, keywords, overview, cast, crew) in the notebook.
        """
        title_lower = movie_title.lower()

        if title_lower not in self._title_index:
            return []

        idx = self._title_index[title_lower]
        # Get similarity scores for all movies relative to the target
        sim_scores = list(enumerate(self.similarity[idx]))
        # Sort descending by score, skip index 0 (the movie itself)
        sim_scores = sorted(sim_scores, reverse=True, key=lambda x: x[1])

        recommendations: list[RecommendedMovie] = []
        for movie_idx, score in sim_scores[1 : count + 1]:
            row = self.movies.iloc[movie_idx]
            recommendations.append(
                RecommendedMovie(
                    movie_id=int(row["movie_id"]),
                    title=str(row["title"]),
                    similarity_score=round(float(score), 4),
                    poster_url=None,  # Populated by the API layer via TMDB
                )
            )

        return recommendations
