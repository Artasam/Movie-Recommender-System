/**
 * Global theme store using Zustand.
 * Persists theme choice to localStorage and syncs with the DOM
 * data-theme attribute for CSS variable switching.
 */

import { create } from 'zustand';
import type { Theme } from '../types';

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

/** Read the saved theme or fall back to system preference / dark. */
function getInitialTheme(): Theme {
  const saved = localStorage.getItem('theme') as Theme | null;
  if (saved === 'dark' || saved === 'light') return saved;

  // Respect system preference
  if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }
  return 'dark';
}

/** Apply theme to the DOM. */
function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

export const useThemeStore = create<ThemeState>((set) => {
  // Apply initial theme immediately
  const initial = getInitialTheme();
  applyTheme(initial);

  return {
    theme: initial,

    toggleTheme: () =>
      set((state) => {
        const next: Theme = state.theme === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        return { theme: next };
      }),

    setTheme: (theme: Theme) => {
      applyTheme(theme);
      set({ theme });
    },
  };
});
