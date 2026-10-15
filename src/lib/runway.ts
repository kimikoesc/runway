// Pure math for the runway. No React here, so it is easy to test and reuse (e.g. on a backend later).
import type { Expense, Income } from '../types'

// STRIP_MONTHS is how many month blocks the runway strip shows (two years).
export const STRIP_MONTHS = 24

// positive() turns negative or non-numbers into 0 so bad input can't break the totals.
const positive = (n: number) => (n > 0 ? n : 0)

// totalIncome() adds up all income amounts so the page can show monthly income.
export function totalIncome(incomes: Income[]): number {
  return incomes.reduce((sum, i) => sum + positive(i.amount), 0)
}

// totalSpending() adds up only the checked expenses, because unchecked ones are left out on purpose.
export function totalSpending(expenses: Expense[]): number {
  return expenses.reduce((sum, e) => (e.enabled ? sum + positive(e.amount) : sum), 0)
}

// runwayMonths() is how many months savings last. Infinity means income covers spending.
export function runwayMonths(savings: number, netBurn: number): number {
  if (netBurn <= 0) return Infinity
  return positive(savings) / netBurn
}

// runOutDate() is the date savings run out: whole months first, then the leftover fraction as days.
export function runOutDate(from: Date, months: number): Date {
  // Jump to the 1st of the target month, then clamp the day, so Oct 31 + 4 months is Feb 28, not "Feb 31" = Mar 3.
  const date = new Date(from.getFullYear(), from.getMonth() + Math.floor(months), 1)
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  date.setDate(Math.min(from.getDate(), lastDay) + Math.round((months % 1) * 30))
  return date
}

// stripFills() says how full each month block is (1 = full, 0.5 = half, 0 = empty), for the runway strip.
export function stripFills(months: number): number[] {
  return Array.from({ length: STRIP_MONTHS }, (_, i) => Math.min(1, Math.max(0, months - i)))
}

// RunwayZone groups the runway into short / medium / long so the strip can change shade.
export type RunwayZone = 'low' | 'mid' | 'high'

// runwayZone() picks the zone: under 6 months is low, under 12 is mid, 12 or more (or infinite) is high.
export function runwayZone(months: number): RunwayZone {
  if (months < 6) return 'low'
  if (months < 12) return 'mid'
  return 'high'
}
