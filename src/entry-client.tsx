import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import '@fontsource-variable/geist/wght.css';
import '@fontsource/instrument-serif/latin-400-italic.css';
import './styles/index.css';
import App from './App';

const root = document.getElementById('root')!;
const app = (
  <StrictMode>
    <App path={location.pathname} />
  </StrictMode>
);

// Prerendered pages hydrate; the dev server renders from scratch.
if (root.hasChildNodes())
  hydrateRoot(root, app, {
    onRecoverableError: (err) => console.error('[hydration]', err instanceof Error ? err.message : err),
  });
else createRoot(root).render(app);

// PWA: register the service worker in production only.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}
