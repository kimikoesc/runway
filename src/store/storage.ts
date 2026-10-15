// Where the app's data is saved initially.
// TODO: Update this once backend is implemented
import type { RunwayState } from '../types'
import { CURRENCIES } from '../lib/format'

// STORAGE_KEY names the localStorage entry. The "v1" lets us change the data shape later without reading old data wrongly.
const STORAGE_KEY = 'runway:v1'

// DEFAULT_STATE is what a first-time visitor sees: common items with every amount at 0, ready to fill in.
export const DEFAULT_STATE: RunwayState = {
  currency: 'JPY',
  savings: 0,
  incomes: [{ id: crypto.randomUUID(), name: 'Salary', amount: 0 }],
  expenses: [
    { id: crypto.randomUUID(), name: 'Rent', amount: 0, enabled: true },
    { id: crypto.randomUUID(), name: 'Utilities', amount: 0, enabled: true },
    { id: crypto.randomUUID(), name: 'Groceries', amount: 0, enabled: true },
    { id: crypto.randomUUID(), name: 'Transport', amount: 0, enabled: true },
    { id: crypto.randomUUID(), name: 'Phone', amount: 0, enabled: true },
    { id: crypto.randomUUID(), name: 'Insurance', amount: 0, enabled: true },
    { id: crypto.randomUUID(), name: 'Eating out', amount: 0, enabled: true },
  ],
}

// isItem() checks one saved income/expense has the fields we need, so bad data can't crash the page.
function isItem(x: unknown): x is { id: string; name: string; amount: number } {
  const item = x as Record<string, unknown>
  return typeof item === 'object' && item !== null && typeof item.id === 'string' &&
    typeof item.name === 'string' && typeof item.amount === 'number'
}

// isRunwayState() checks saved data has the full, correct shape before we trust it.
function isRunwayState(x: unknown): x is RunwayState {
  const s = x as Record<string, unknown>
  return typeof s === 'object' && s !== null &&
    CURRENCIES.includes(s.currency as RunwayState['currency']) &&
    typeof s.savings === 'number' &&
    Array.isArray(s.incomes) && s.incomes.every(isItem) &&
    Array.isArray(s.expenses) && s.expenses.every((e: Record<string, unknown>) => typeof e.enabled === 'boolean' && isItem(e))
}

// loadState() reads saved data, or returns the defaults if nothing valid is saved.
export function loadState(): RunwayState {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null')
    return isRunwayState(parsed) ? parsed : DEFAULT_STATE
  } catch {
    // Broken JSON, or storage blocked (e.g. some private browsing modes).
    return DEFAULT_STATE
  }
}

// saveState() writes the data. Failures are ignored so the app keeps working without storage.
export function saveState(state: RunwayState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Storage full or blocked: the page still works, it just won't remember.
  }
}
