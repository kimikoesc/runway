import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import { runwayStore } from './store/runwayStore'
import { DEFAULT_STATE } from './store/storage'

// Every test starts from the default sample data.
beforeEach(() => runwayStore.setState(structuredClone(DEFAULT_STATE)))

it('renders the app title', () => {
  render(<App />)
  expect(screen.getByRole('heading', { name: /runway/i })).toBeInTheDocument()
})

it('shows the runway from the default data', () => {
  render(<App />)
  expect(screen.getByText('9.0 months')).toBeInTheDocument()
  expect(screen.getByText(/spending ¥377,251 and earning ¥132,600 a month\./)).toBeInTheDocument()
})

it('leaves unchecked expenses out of the runway', () => {
  render(<App />)
  userEvent.click(screen.getByLabelText('Include Rent'))
  expect(screen.getByText('23.2 months')).toBeInTheDocument()
})

it('saves changes to localStorage', () => {
  render(<App />)
  userEvent.click(screen.getByLabelText('Include Rent'))
  expect(JSON.parse(localStorage.getItem('runway:v1')!).expenses[0].enabled).toBe(false)
})

it('adds an income source', () => {
  render(<App />)
  expect(screen.getByRole('button', { name: 'Delete Salary' })).toBeDisabled()
  userEvent.click(screen.getByRole('button', { name: 'Add income source' }))
  expect(screen.getByLabelText('Rename New income')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Delete Salary' })).toBeEnabled()
})

it('adds and deletes an expense', () => {
  render(<App />)
  userEvent.click(screen.getByRole('button', { name: 'Add expense' }))
  expect(screen.getByLabelText('Rename New expense')).toBeInTheDocument()
  userEvent.click(screen.getByRole('button', { name: 'Delete New expense' }))
  expect(screen.queryByLabelText('Rename New expense')).not.toBeInTheDocument()
})

it('switches currency', () => {
  render(<App />)
  userEvent.selectOptions(screen.getByLabelText('Currency'), 'USD')
  expect(screen.getByText(/spending \$377,251\.00/)).toBeInTheDocument()
})

it('shows infinite runway when income covers spending', () => {
  render(<App />)
  const salary = screen.getByLabelText('Salary amount')
  userEvent.clear(salary)
  userEvent.type(salary, '400000')
  expect(screen.getByText('∞')).toBeInTheDocument()
  expect(screen.getByText('Your income covers your spending — savings never run out.')).toBeInTheDocument()
})
