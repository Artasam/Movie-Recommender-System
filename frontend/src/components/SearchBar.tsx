/**
 * SearchBar — Debounced autocomplete search input with dropdown results.
 * Searches movie titles via the backend API as the user types.
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, X, Film } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';
import { searchMovies } from '../services/api';
import type { Movie } from '../types';

interface SearchBarProps {
  onSelect: (movie: Movie) => void;
  placeholder?: string;
  /** Optional: auto-focus the input on mount */
  autoFocus?: boolean;
}

export function SearchBar({
  onSelect,
  placeholder = 'Search 4,800+ movies...',
  autoFocus = false,
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const debouncedQuery = useDebounce(query, 250);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch search results when debounced query changes
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    let cancelled = false;

    async function fetchResults() {
      setIsLoading(true);
      try {
        const data = await searchMovies(debouncedQuery, 8);
        if (!cancelled) {
          setResults(data.movies);
          setIsOpen(data.movies.length > 0);
          setHighlightedIndex(-1);
        }
      } catch {
        if (!cancelled) {
          setResults([]);
          setIsOpen(false);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchResults();
    return () => { cancelled = true; };
  }, [debouncedQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = useCallback(
    (movie: Movie) => {
      setQuery(movie.title);
      setIsOpen(false);
      setResults([]);
      onSelect(movie);
    },
    [onSelect]
  );

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : results.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < results.length) {
          handleSelect(results[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  return (
    <div className="search-container" ref={containerRef}>
      <div className="search-wrapper">
        <Search size={20} className="search-icon" aria-hidden="true" />
        <input
          ref={inputRef}
          id="movie-search-input"
          type="text"
          className="search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          autoComplete="off"
          autoFocus={autoFocus}
          role="combobox"
          aria-expanded={isOpen}
          aria-controls="search-results"
          aria-activedescendant={
            highlightedIndex >= 0 ? `search-result-${highlightedIndex}` : undefined
          }
          aria-label="Search for a movie"
        />
        {query && (
          <button
            className="search-clear"
            onClick={handleClear}
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {isOpen && (
        <div
          id="search-results"
          className="search-dropdown"
          role="listbox"
          aria-label="Search results"
        >
          {results.map((movie, index) => (
            <div
              key={movie.movie_id}
              id={`search-result-${index}`}
              className={`search-dropdown-item ${
                index === highlightedIndex ? 'highlighted' : ''
              }`}
              role="option"
              aria-selected={index === highlightedIndex}
              onClick={() => handleSelect(movie)}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              <Film size={16} className="search-dropdown-item-icon" />
              <span>{movie.title}</span>
            </div>
          ))}
          {results.length === 0 && !isLoading && (
            <div className="search-dropdown-empty">
              No movies found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
