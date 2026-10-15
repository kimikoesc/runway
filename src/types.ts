// Shared data types for the whole app. `type` only exists for TypeScript; it disappears at runtime.

// Currency is one of the currency codes the user can pick.
export type Currency = 'JPY' | 'USD' | 'EUR' | 'GBP' | 'PHP'

// Income is one source of monthly income, e.g. "Salary".
export type Income = { id: string; name: string; amount: number }

// Expense is one monthly spending item. `enabled` = checked, i.e. counted in the totals.
export type Expense = { id: string; name: string; amount: number; enabled: boolean }

// RunwayState is everything the app saves: the one source of truth for the page.
export type RunwayState = {
  currency: Currency
  savings: number
  incomes: Income[]
  expenses: Expense[]
}
