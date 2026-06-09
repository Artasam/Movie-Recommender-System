/**
 * Footer — Simple site footer with credits and links.
 */

import { Film, Github, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-inner">
        <div className="footer-text">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Film size={14} aria-hidden="true" />
            CineMatch — AI-Powered Movie Recommendations
          </span>
        </div>

        <div className="footer-links">
          <a
            href="https://github.com/Artasam/Movie-Recommender-System"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
            aria-label="View source on GitHub"
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Github size={14} aria-hidden="true" />
              GitHub
            </span>
          </a>
          <span className="footer-text">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              Made with <Heart size={12} aria-hidden="true" style={{ color: 'var(--color-error)' }} /> by Artasam
            </span>
          </span>
        </div>
      </div>
    </footer>
  );
}
