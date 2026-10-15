import { totalIncome, totalSpending, runwayMonths, runOutDate, stripFills, runwayZone } from './runway'
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

describe('stripFills', () => {
  it('fills one block per month and part of the last', () => {
    const fills = stripFills(2.5)
    expect(fills).toHaveLength(24)
    expect(fills.slice(0, 4)).toEqual([1, 1, 0.5, 0])
  })
  it('fills every block for 24+ months or infinite runway', () => {
    expect(stripFills(30).every((f) => f === 1)).toBe(true)
    expect(stripFills(Infinity).every((f) => f === 1)).toBe(true)
  })
  it('fills nothing with no runway', () => {
    expect(stripFills(0).every((f) => f === 0)).toBe(true)
  })
})

describe('runwayZone', () => {
  it('is low under 6 months, mid under 12, high from 12', () => {
    expect(runwayZone(5.9)).toBe('low')
    expect(runwayZone(6)).toBe('mid')
    expect(runwayZone(11.9)).toBe('mid')
    expect(runwayZone(12)).toBe('high')
    expect(runwayZone(Infinity)).toBe('high')
  })
})
