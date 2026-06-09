/**
 * Navbar — Fixed top navigation with glassmorphism effect.
 * Contains brand logo, navigation links, and theme toggle.
 */

import { NavLink } from 'react-router-dom';
import { Film } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export function Navbar() {
  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <NavLink to="/" className="navbar-brand" aria-label="CineMatch Home">
        <span className="navbar-brand-icon" aria-hidden="true">
          <Film size={20} />
        </span>
        CineMatch
      </NavLink>

      <div className="navbar-nav">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `navbar-link ${isActive ? 'active' : ''}`
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/recommend"
          className={({ isActive }) =>
            `navbar-link ${isActive ? 'active' : ''}`
          }
        >
          Discover
        </NavLink>
      </div>

      <div className="navbar-actions">
        <ThemeToggle />
      </div>
    </nav>
  );
}
