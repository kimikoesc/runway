// Pure math for the runway. No React here, so it is easy to test and reuse (e.g. on a backend later).
import type { Expense, Income } from '../types'

// MAX_CHART_MONTHS stops the chart from drawing hundreds of points when the burn is tiny.
const MAX_CHART_MONTHS = 120

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

// balanceSeries() lists the savings balance month by month, which is what the chart draws.
export function balanceSeries(savings: number, netBurn: number): { month: number; balance: number }[] {
  const start = positive(savings)

  // Income covers spending: show one year of a flat or rising balance.
  if (netBurn <= 0) {
    return Array.from({ length: 13 }, (_, month) => ({ month, balance: start - netBurn * month }))
  }

  const months = start / netBurn
  const lastWholeMonth = Math.floor(Math.min(months, MAX_CHART_MONTHS))
  const points = Array.from({ length: lastWholeMonth + 1 }, (_, month) => ({
    month,
    balance: start - netBurn * month,
  }))
  // Money runs out partway through a month: add that exact point at zero.
  if (months <= MAX_CHART_MONTHS && months % 1 !== 0) points.push({ month: months, balance: 0 })
  return points
}
