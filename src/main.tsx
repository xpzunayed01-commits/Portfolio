// Safeguard against third-party polyfills attempting to write to read-only window.fetch
try {
  const origFetch = window.fetch;
  if (origFetch) {
    let activeFetch = origFetch;
    try {
      Object.defineProperty(window, 'fetch', {
        configurable: true,
        enumerable: true,
        get: () => activeFetch,
        set: (fn) => { activeFetch = fn; }
      });
    } catch {
      try {
        Object.defineProperty(Window.prototype, 'fetch', {
          configurable: true,
          enumerable: true,
          get: () => activeFetch,
          set: (fn) => { activeFetch = fn; }
        });
      } catch {}
    }
  }
} catch {}

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
