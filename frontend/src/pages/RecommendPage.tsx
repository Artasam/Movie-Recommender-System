/**
 * RecommendPage — The core recommendation interface.
 * Select a movie, choose how many recommendations, and see similar movies.
 */

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Minus,
  Plus,
  Wand2,
  AlertCircle,
  Popcorn,
  Loader2,
} from 'lucide-react';
import { SearchBar } from '../components/SearchBar';
import { MovieCard, MovieCardSkeleton } from '../components/MovieCard';
import { getRecommendations } from '../services/api';
import type { Movie, RecommendResponse } from '../types';
import toast from 'react-hot-toast';

export function RecommendPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [count, setCount] = useState(5);
  const [result, setResult] = useState<RecommendResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle pre-filled movie from URL query param
  useEffect(() => {
    const movieParam = searchParams.get('movie');
    if (movieParam && !selectedMovie) {
      setSelectedMovie({ movie_id: 0, title: movieParam });
      // Auto-trigger recommendation
      fetchRecommendations(movieParam, count);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchRecommendations = useCallback(
    async (title: string, numResults: number) => {
      setIsLoading(true);
      setError(null);
      setResult(null);

      try {
        const data = await getRecommendations({
          movie_title: title,
          count: numResults,
        });
        setResult(data);
        setSelectedMovie(data.source_movie);
        toast.success(
          `Found ${data.recommendations.length} recommendations!`,
          { icon: '🎬' }
        );
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to get recommendations';
        setError(message);
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie);
    setSearchParams({ movie: movie.title });
    fetchRecommendations(movie.title, count);
  };

  const handleCountChange = (delta: number) => {
    setCount((prev) => Math.max(1, Math.min(20, prev + delta)));
  };

  const handleRecommend = () => {
    if (!selectedMovie) {
      toast.error('Please select a movie first');
      return;
    }
    setSearchParams({ movie: selectedMovie.title });
    fetchRecommendations(selectedMovie.title, count);
  };

  return (
    <div className="recommend-page page-enter">
      <div className="container">
        {/* ── Header ───────────────────────────────────────── */}
        <header className="recommend-header">
          <h1 className="recommend-title">
            <span className="gradient-text">Discover</span> Similar Movies
          </h1>
          <p className="recommend-subtitle">
            Select a movie you love and we'll find similar titles using
            AI-powered content analysis
          </p>
        </header>

        {/* ── Controls ─────────────────────────────────────── */}
        <div className="recommend-controls">
          <SearchBar
            onSelect={handleMovieSelect}
            placeholder="Type a movie title..."
          />

          <div className="recommend-actions">
            <div className="counter-group">
              <span className="counter-label">Results:</span>
              <div className="counter-controls">
                <button
                  className="counter-btn"
                  onClick={() => handleCountChange(-1)}
                  disabled={count <= 1}
                  aria-label="Decrease count"
                >
                  <Minus size={16} />
                </button>
                <span className="counter-value" aria-live="polite">
                  {count}
                </span>
                <button
                  className="counter-btn"
                  onClick={() => handleCountChange(1)}
                  disabled={count >= 20}
                  aria-label="Increase count"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <button
              className="btn btn-primary btn-lg"
              onClick={handleRecommend}
              disabled={!selectedMovie || isLoading}
              id="recommend-button"
            >
              {isLoading ? (
                <Loader2 size={18} className="spinner" />
              ) : (
                <Wand2 size={18} />
              )}
              {isLoading ? 'Finding...' : 'Get Recommendations'}
            </button>
          </div>
        </div>

        {/* ── Results ──────────────────────────────────────── */}
        <div className="recommend-results">
          {/* Loading State */}
          {isLoading && (
            <div className="movie-grid">
              {Array.from({ length: count }).map((_, i) => (
                <MovieCardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="error-state">
              <AlertCircle size={48} className="error-state-icon" />
              <h3 className="error-state-title">Something went wrong</h3>
              <p className="error-state-message">{error}</p>
              <button
                className="btn btn-secondary"
                onClick={() => selectedMovie && fetchRecommendations(selectedMovie.title, count)}
              >
                Try Again
              </button>
            </div>
          )}

          {/* Success State */}
          {result && !isLoading && (
            <>
              {/* Source Movie Card */}
              <div className="source-movie">
                {result.recommendations[0]?.poster_url && (
                  <img
                    className="source-movie-poster"
                    src={result.recommendations[0].poster_url}
                    alt=""
                    aria-hidden="true"
                  />
                )}
                <div className="source-movie-info">
                  <span className="source-movie-label">Based on</span>
                  <h2 className="source-movie-title">
                    {result.source_movie.title}
                  </h2>
                  <p className="source-movie-subtitle">
                    Showing {result.recommendations.length} similar movies
                  </p>
                </div>
              </div>

              {/* Recommendations Grid */}
              <div className="section-header">
                <h2 className="section-title">You Might Also Like</h2>
                <span className="section-subtitle">
                  Ranked by content similarity
                </span>
              </div>

              <div className="movie-grid">
                {result.recommendations.map((movie) => (
                  <MovieCard
                    key={movie.movie_id}
                    movie={movie}
                    onClick={() => handleMovieSelect(movie)}
                  />
                ))}
              </div>
            </>
          )}

          {/* Empty State (no search yet) */}
          {!result && !isLoading && !error && (
            <div className="empty-state">
              <Popcorn size={56} className="empty-state-icon" />
              <h3 className="empty-state-title">Ready to explore?</h3>
              <p className="empty-state-message">
                Search for a movie above and we'll find similar titles you'll
                love. Try "Avatar", "The Dark Knight", or "Inception"!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
