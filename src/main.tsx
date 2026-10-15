// Entry point: mounts the React app into <div id="root"> in index.html.
// Svelte equivalent: `new App({ target: document.getElementById('root') })` / `mount(App, ...)`.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

// StrictMode runs extra checks in development only (e.g. renders components twice to catch side effects).
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
