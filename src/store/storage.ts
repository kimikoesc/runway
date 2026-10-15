// Where the app's data is saved. Today: the browser's localStorage.
// When the backend arrives, only this file changes (loadState/saveState call the API instead).
import type { RunwayState } from '../types'
import { CURRENCIES } from '../lib/format'

// STORAGE_KEY names the localStorage entry. The "v1" lets us change the data shape later without reading old data wrongly.
const STORAGE_KEY = 'runway:v1'

// DEFAULT_STATE is what a first-time visitor sees. It works out to 9.0 months of runway.
export const DEFAULT_STATE: RunwayState = {
  currency: 'JPY',
  savings: 2_200_000,
  incomes: [{ id: crypto.randomUUID(), name: 'Salary', amount: 132_600 }],
  expenses: [
    { id: crypto.randomUUID(), name: 'Rent', amount: 150_000, enabled: true },
    { id: crypto.randomUUID(), name: 'Utilities', amount: 18_500, enabled: true },
    { id: crypto.randomUUID(), name: 'Groceries', amount: 60_000, enabled: true },
    { id: crypto.randomUUID(), name: 'Transport', amount: 20_000, enabled: true },
    { id: crypto.randomUUID(), name: 'Phone & internet', amount: 8_751, enabled: true },
    { id: crypto.randomUUID(), name: 'Insurance', amount: 40_000, enabled: true },
    { id: crypto.randomUUID(), name: 'Eating out', amount: 80_000, enabled: true },
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
