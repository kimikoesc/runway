import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ThemeToggle from './ThemeToggle'

// fakeDeviceTheme() pretends the device is set to dark or light mode (jsdom has no matchMedia).
function fakeDeviceTheme(dark: boolean) {
  vi.stubGlobal('matchMedia', (query: string) => ({ matches: dark && query.includes('dark') }))
}

afterEach(() => vi.unstubAllGlobals())

it('follows the device setting when nothing is saved', () => {
  fakeDeviceTheme(true)
  render(<ThemeToggle />)
  expect(screen.getByRole('button', { name: 'Switch to light mode' })).toBeInTheDocument()
})

it('switches theme on tap and remembers it', () => {
  fakeDeviceTheme(false)
  render(<ThemeToggle />)
  userEvent.click(screen.getByRole('button', { name: 'Switch to dark mode' }))
  expect(document.documentElement.dataset.theme).toBe('dark')
  expect(localStorage.getItem('runway:theme')).toBe('dark')
  expect(screen.getByRole('button', { name: 'Switch to light mode' })).toBeInTheDocument()
})

it('uses a saved choice over the device setting', () => {
  fakeDeviceTheme(true)
  localStorage.setItem('runway:theme', 'light')
  render(<ThemeToggle />)
  expect(screen.getByRole('button', { name: 'Switch to dark mode' })).toBeInTheDocument()
})
