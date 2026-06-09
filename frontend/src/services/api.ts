/**
 * Centralized API service layer.
 * All backend communication flows through this module — never inline
 * fetch/axios in components.
 */

import axios from 'axios';
import type {
  ApiResponse,
  MovieSearchResult,
  RecommendRequest,
  RecommendResponse,
  Movie,
  PosterResponse,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

/** Pre-configured Axios instance with base URL and timeout. */
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Movie Endpoints ────────────────────────────────────────────

/** List all movies with pagination. */
export async function listMovies(
  page: number = 1,
  limit: number = 20
): Promise<MovieSearchResult> {
  const { data } = await api.get<ApiResponse<MovieSearchResult>>(
    '/api/v1/movies',
    { params: { page, limit } }
  );
  if (!data.success || !data.data) {
    throw new Error(data.message || 'Failed to fetch movies');
  }
  return data.data;
}

/** Search movies by title substring. */
export async function searchMovies(
  query: string,
  limit: number = 10
): Promise<MovieSearchResult> {
  const { data } = await api.get<ApiResponse<MovieSearchResult>>(
    '/api/v1/movies/search',
    { params: { q: query, limit } }
  );
  if (!data.success || !data.data) {
    throw new Error(data.message || 'Search failed');
  }
  return data.data;
}

/** Get a single movie by TMDB ID. */
export async function getMovie(movieId: number): Promise<Movie> {
  const { data } = await api.get<ApiResponse<Movie>>(
    `/api/v1/movies/${movieId}`
  );
  if (!data.success || !data.data) {
    throw new Error(data.message || 'Movie not found');
  }
  return data.data;
}

/** Get poster URL for a movie. */
export async function getMoviePoster(movieId: number): Promise<PosterResponse> {
  const { data } = await api.get<ApiResponse<PosterResponse>>(
    `/api/v1/movies/${movieId}/poster`
  );
  if (!data.success || !data.data) {
    throw new Error(data.message || 'Poster not found');
  }
  return data.data;
}

// ── Recommendation Endpoint ────────────────────────────────────

/** Get movie recommendations based on cosine similarity. */
export async function getRecommendations(
  request: RecommendRequest
): Promise<RecommendResponse> {
  const { data } = await api.post<ApiResponse<RecommendResponse>>(
    '/api/v1/recommend',
    request
  );
  if (!data.success || !data.data) {
    throw new Error(data.message || 'Recommendation failed');
  }
  return data.data;
}

// ── Health Check ───────────────────────────────────────────────

/** Check if the backend API is healthy. */
export async function healthCheck(): Promise<{ status: string; version: string }> {
  const { data } = await api.get<ApiResponse<{ status: string; version: string }>>(
    '/health'
  );
  if (!data.success || !data.data) {
    throw new Error('API health check failed');
  }
  return data.data;
}

export default api;
