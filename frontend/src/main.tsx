/**
 * Application entry point.
 * Imports CSS in correct cascade order and mounts the React app.
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// CSS imports — order matters for proper cascade
import './styles/variables.css';
import './styles/reset.css';
import './styles/global.css';
import './styles/components.css';
import './styles/pages.css';

import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
