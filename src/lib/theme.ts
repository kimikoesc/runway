// Light/dark theme: read the user's saved choice or the device setting, and apply a new choice.

// Theme is the two looks the app has.
export type Theme = 'light' | 'dark'

// THEME_KEY names the localStorage entry for the user's choice (index.html reads it too, before the page paints).
const THEME_KEY = 'runway:theme'

// getTheme() returns the saved choice, or the device's setting when the user hasn't picked one.
export function getTheme(): Theme {
  try {
    const saved = localStorage.getItem(THEME_KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    // Storage blocked: fall through to the device setting.
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

// setTheme() applies a theme to the page (CSS swaps colors on data-theme) and remembers it.
export function setTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme
  try {
    localStorage.setItem(THEME_KEY, theme)
  } catch {
    // Storage blocked: the theme still applies for this visit.
  }
}
