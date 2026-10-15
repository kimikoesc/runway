import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

// StrictMode runs extra checks in development only (e.g. renders components twice to catch side effects).
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
