/* ── Movie Recommender API — TypeScript Type Definitions ────── */

/** Standardized API response envelope matching the backend schema. */
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message: string;
  errors: unknown;
}

/** Base movie representation. */
export interface Movie {
  movie_id: number;
  title: string;
}

/** Search result container with total count. */
export interface MovieSearchResult {
  movies: Movie[];
  total: number;
}

/** A recommended movie with similarity score and optional poster. */
export interface RecommendedMovie extends Movie {
  poster_url: string | null;
  similarity_score: number;
}

/** Full recommendation response from POST /api/v1/recommend. */
export interface RecommendResponse {
  source_movie: Movie;
  recommendations: RecommendedMovie[];
}

/** Request body for the recommendation endpoint. */
export interface RecommendRequest {
  movie_title: string;
  count: number;
}

/** Poster response from GET /api/v1/movies/:id/poster. */
export interface PosterResponse {
  movie_id: number;
  poster_url: string | null;
}

/** Theme options. */
export type Theme = 'dark' | 'light';
