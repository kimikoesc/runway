// SAMPLE_STATE is example data for tests: it works out to 9.0 months of runway
// (¥2,200,000 savings, ¥377,251 spending, ¥132,600 income), so tests don't depend on the app's defaults.
import type { RunwayState } from '../types'

export const SAMPLE_STATE: RunwayState = {
  currency: 'JPY',
  savings: 2_200_000,
  incomes: [{ id: 'salary', name: 'Salary', amount: 132_600 }],
  expenses: [
    { id: 'rent', name: 'Rent', amount: 150_000, enabled: true },
    { id: 'utilities', name: 'Utilities', amount: 18_500, enabled: true },
    { id: 'groceries', name: 'Groceries', amount: 60_000, enabled: true },
    { id: 'transport', name: 'Transport', amount: 20_000, enabled: true },
    { id: 'phone', name: 'Phone', amount: 8_751, enabled: true },
    { id: 'insurance', name: 'Insurance', amount: 40_000, enabled: true },
    { id: 'eating-out', name: 'Eating out', amount: 80_000, enabled: true },
  ],
}
