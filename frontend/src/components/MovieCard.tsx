/**
 * MovieCard — Displays a movie poster with title and optional similarity badge.
 * Features hover lift + glow animation and graceful poster fallback.
 */

import { Film } from 'lucide-react';
import type { RecommendedMovie } from '../types';

interface MovieCardProps {
  movie: RecommendedMovie;
  /** Optional click handler for the card */
  onClick?: () => void;
}

export function MovieCard({ movie, onClick }: MovieCardProps) {
  const matchPercent = Math.round(movie.similarity_score * 100);

  return (
    <article
      className="movie-card animate-in"
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`${movie.title}${matchPercent > 0 ? `, ${matchPercent}% match` : ''}`}
    >
      {movie.poster_url ? (
        <img
          className="movie-card-poster"
          src={movie.poster_url}
          alt={`${movie.title} poster`}
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div className="movie-card-placeholder" aria-hidden="true">
          <Film size={40} className="movie-card-placeholder-icon" />
          <span>{movie.title}</span>
        </div>
      )}

      <div className="movie-card-info">
        <h3 className="movie-card-title">{movie.title}</h3>
      </div>

      {matchPercent > 0 && (
        <div className="movie-card-badge" aria-label={`${matchPercent}% match`}>
          {matchPercent}% match
        </div>
      )}
    </article>
  );
}

/**
 * MovieCardSkeleton — Shimmer loading placeholder for MovieCard.
 */
export function MovieCardSkeleton() {
  return (
    <div className="movie-card" aria-hidden="true">
      <div className="skeleton skeleton-card" />
    </div>
  );
}
