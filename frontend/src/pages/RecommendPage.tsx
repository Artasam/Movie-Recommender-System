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
  const [searchQuery, setSearchQuery] = useState('');
  const [count, setCount] = useState(5);
  const [result, setResult] = useState<RecommendResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle pre-filled movie from URL query param
  useEffect(() => {
    const movieParam = searchParams.get('movie');
    if (movieParam && !selectedMovie) {
      setSelectedMovie({ movie_id: 0, title: movieParam });
      setSearchQuery(movieParam);
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
      } catch (err: any) {
        let message = 'Failed to get recommendations';
        if (err?.response?.status === 404) {
          message = `Movie "${title}" not found in our database.`;
        } else if (err?.response?.data?.detail) {
          message = err.response.data.detail;
        } else if (err instanceof Error) {
          message = err.message;
        }
        setError(message);
        toast.error(message, { icon: '🍿' });
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie);
    setSearchQuery(movie.title);
    setSearchParams({ movie: movie.title });
    fetchRecommendations(movie.title, count);
  };

  const handleCountChange = (delta: number) => {
    setCount((prev) => Math.max(1, Math.min(20, prev + delta)));
  };

  const handleRecommend = () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a movie title');
      return;
    }
    setSearchParams({ movie: searchQuery });
    fetchRecommendations(searchQuery, count);
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
            initialQuery={searchQuery}
            onQueryChange={setSearchQuery}
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
              disabled={!searchQuery.trim() || isLoading}
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



          {/* Success State */}
          {result && !isLoading && (
            <>
              {/* Source Movie Card */}
              <div className="source-movie">
                {result.source_movie.poster_url && (
                  <img
                    className="source-movie-poster"
                    src={result.source_movie.poster_url}
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

          {/* Empty / Error State */}
          {!result && !isLoading && (
            <div className="empty-state">
              <Popcorn size={56} className="empty-state-icon" style={{ opacity: error ? 0.8 : 0.4 }} />
              <h3 className="empty-state-title">{error ? 'No Results Found' : 'Ready to explore?'}</h3>
              <p className="empty-state-message">
                {error 
                  ? 'We couldn\'t find a match for that title. Try searching for a different movie!'
                  : 'Search for a movie above and we\'ll find similar titles you\'ll love. Try "Avatar", "The Dark Knight", or "Inception"!'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
