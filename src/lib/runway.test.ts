import { totalIncome, totalSpending, runwayMonths, runOutDate, balanceSeries } from './runway'
import type { Expense, Income } from '../types'

// Small helpers so each test only spells out the field it cares about.
const income = (amount: number): Income => ({ id: String(amount), name: 'x', amount })
const expense = (amount: number, enabled = true): Expense => ({ id: String(amount), name: 'x', amount, enabled })

describe('totals', () => {
  it('adds up income', () => {
    expect(totalIncome([income(132600), income(1000)])).toBe(133600)
  })
  it('only counts enabled expenses', () => {
    expect(totalSpending([expense(100), expense(50, false)])).toBe(100)
  })
  it('treats negative amounts as 0', () => {
    expect(totalSpending([expense(-5)])).toBe(0)
  })
})

describe('runwayMonths', () => {
  it('divides savings by net burn', () => {
    expect(runwayMonths(2200000, 244651).toFixed(1)).toBe('9.0')
  })
  it('is 0 with no savings', () => {
    expect(runwayMonths(0, 1000)).toBe(0)
  })
  it('is Infinity when income covers spending', () => {
    expect(runwayMonths(1000, 0)).toBe(Infinity)
    expect(runwayMonths(1000, -5)).toBe(Infinity)
  })
})

describe('runOutDate', () => {
  it('adds fractional months to the start date', () => {
    const d = runOutDate(new Date(2026, 9, 15), 8.99)
    expect(d.getMonth()).toBe(6)
    expect(d.getFullYear()).toBe(2027)
  })
})

it('runOutDate does not roll past short months', () => {
  const d = runOutDate(new Date(2026, 9, 31), 4)
  expect(d.getMonth()).toBe(1)
  expect(d.getFullYear()).toBe(2027)
})

describe('balanceSeries', () => {
  it('steps down by net burn each month to zero', () => {
    expect(balanceSeries(3000, 1000)).toEqual([
      { month: 0, balance: 3000 },
      { month: 1, balance: 2000 },
      { month: 2, balance: 1000 },
      { month: 3, balance: 0 },
    ])
  })
  it('ends at the fractional month where money hits zero', () => {
    expect(balanceSeries(2500, 1000).at(-1)).toEqual({ month: 2.5, balance: 0 })
  })
  it('caps at 120 months', () => {
    expect(balanceSeries(1000, 1)).toHaveLength(121)
  })
  it('shows 12 flat months when burn is zero', () => {
    const s = balanceSeries(1000, 0)
    expect(s).toHaveLength(13)
    expect(s.every((p) => p.balance === 1000)).toBe(true)
  })
  it('shows 12 rising months when income exceeds spending', () => {
    const s = balanceSeries(1000, -100)
    expect(s).toHaveLength(13)
    expect(s.at(-1)!.balance).toBe(2200)
  })
})
