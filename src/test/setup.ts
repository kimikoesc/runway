// Runs before every test file.
// Adds DOM matchers like toBeInTheDocument() to expect().
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'

// Start each test with empty storage and an empty page so tests can't affect each other.
beforeEach(() => localStorage.clear())
afterEach(() => {
  cleanup()
  document.documentElement.removeAttribute('data-theme')
})
