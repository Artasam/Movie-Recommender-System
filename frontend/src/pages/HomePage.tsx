/**
 * HomePage — Landing page with cinematic hero, search bar, and popular movies grid.
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Clapperboard, Star, TrendingUp } from 'lucide-react';
import { SearchBar } from '../components/SearchBar';
import { MovieCard, MovieCardSkeleton } from '../components/MovieCard';
import { listMovies, getMoviePoster } from '../services/api';
import type { Movie, RecommendedMovie } from '../types';

export function HomePage() {
  const navigate = useNavigate();
  const [popularMovies, setPopularMovies] = useState<RecommendedMovie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load popular movies on mount
  useEffect(() => {
    let cancelled = false;

    async function loadPopular() {
      try {
        const data = await listMovies(1, 10);

        // Build RecommendedMovie objects (no similarity score for popular)
        const moviesWithPosters: RecommendedMovie[] = data.movies.map((m) => ({
          ...m,
          poster_url: null,
          similarity_score: 0,
        }));

        if (!cancelled) {
          setPopularMovies(moviesWithPosters);
          setIsLoading(false);
        }

        // Fetch posters in the background (non-blocking progressive loading)
        const posterPromises = data.movies.map(async (m, idx) => {
          try {
            const poster = await getMoviePoster(m.movie_id);
            if (!cancelled) {
              setPopularMovies((prev) => {
                const next = [...prev];
                if (next[idx]) {
                  next[idx] = { ...next[idx], poster_url: poster.poster_url };
                }
                return next;
              });
            }
          } catch {
            // Poster fetch failure is non-critical
          }
        });

        await Promise.allSettled(posterPromises);
      } catch {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadPopular();
    return () => { cancelled = true; };
  }, []);

  const handleMovieSelect = (movie: Movie) => {
    navigate(`/recommend?movie=${encodeURIComponent(movie.title)}`);
  };

  return (
    <div className="home-page page-enter">
      {/* ── Hero Section ─────────────────────────────────────── */}
      <section className="hero" aria-label="Hero">
        <div className="hero-bg" aria-hidden="true">
          <div className="hero-particles">
            <div className="hero-particle" />
            <div className="hero-particle" />
            <div className="hero-particle" />
            <div className="hero-particle" />
            <div className="hero-particle" />
            <div className="hero-particle" />
            <div className="hero-particle" />
            <div className="hero-particle" />
          </div>
        </div>

        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={14} aria-hidden="true" />
            AI-Powered Recommendations
          </div>

          <h1 className="hero-title">
            Discover Your Next{' '}
            <span className="gradient-text">Favorite Movie</span>
          </h1>

          <p className="hero-description">
            Powered by machine learning and content-based filtering.
            Search from thousands of movies and get personalized recommendations
            based on genres, cast, crew, and keywords.
          </p>

          <div className="hero-search">
            <SearchBar onSelect={handleMovieSelect} autoFocus />
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-value">
                <Clapperboard size={18} style={{ display: 'inline', marginRight: 6 }} />
                4,806
              </span>
              <span className="hero-stat-label">Movies</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-value">
                <Star size={18} style={{ display: 'inline', marginRight: 6 }} />
                23M+
              </span>
              <span className="hero-stat-label">Similarity Pairs</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-value">
                <TrendingUp size={18} style={{ display: 'inline', marginRight: 6 }} />
                Instant
              </span>
              <span className="hero-stat-label">Results</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Popular Movies Section ───────────────────────────── */}
      <section className="popular-section" aria-label="Popular movies">
        <div className="section-header">
          <h2 className="section-title">Popular Movies</h2>
          <span className="section-subtitle">Top titles from our database</span>
        </div>

        <div className="movie-grid">
          {isLoading
            ? Array.from({ length: 10 }).map((_, i) => (
                <MovieCardSkeleton key={i} />
              ))
            : popularMovies.map((movie) => (
                <MovieCard
                  key={movie.movie_id}
                  movie={movie}
                  onClick={() => handleMovieSelect(movie)}
                />
              ))}
        </div>
      </section>
    </div>
  );
}
