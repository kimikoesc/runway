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

it('shows 100+ years instead of an impossible date when burn is tiny', () => {
  const state = structuredClone(DEFAULT_STATE)
  state.incomes[0].amount = 377250 // net burn ¥1 → 2.2 million months
  runwayStore.setState(state)
  render(<App />)
  expect(screen.getByText('100+ years')).toBeInTheDocument()
  expect(
    screen.getByText('Savings last over 100 years, spending ¥377,251 and earning ¥377,250 a month.'),
  ).toBeInTheDocument()
})

it('shows currency symbols in the picker', () => {
  render(<App />)
  expect(screen.getByRole('option', { name: 'USD ($)' })).toBeInTheDocument()
  expect(screen.getByRole('option', { name: 'JPY (¥)' })).toBeInTheDocument()
})

it('explains that unchecked spending is left out', () => {
  render(<App />)
  expect(screen.getByText('Unchecked items are not included in the calculation.')).toBeInTheDocument()
})

it('shows a surplus instead of a negative burn when income covers spending', () => {
  const state = structuredClone(DEFAULT_STATE)
  state.incomes[0].amount = 427251 // ¥50,000 more than spending
  runwayStore.setState(state)
  render(<App />)
  expect(screen.getByText('Surplus / month')).toBeInTheDocument()
  expect(screen.getByText('+¥50,000')).toBeInTheDocument()
  expect(screen.queryByText('Net burn / month')).not.toBeInTheDocument()
})
