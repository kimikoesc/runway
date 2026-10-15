// Formatting helpers for money, dates and per-currency limits.
import type { Currency } from '../types'

// CURRENCIES is the list shown in the currency picker.
export const CURRENCIES: Currency[] = ['JPY', 'USD', 'EUR', 'GBP', 'PHP']

// formatMoney() shows an amount with the right symbol and decimals, e.g. ¥377,251 or $1,234.50.
// Intl.NumberFormat is built into the browser and knows that yen has no decimals.
export function formatMoney(amount: number, currency: Currency): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)
}

// formatMonthYear() shows a date as "July 2027" for the runway sentence.
export function formatMonthYear(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

// sliderMax() is the top of the income slider; yen amounts are much larger than other currencies.
export function sliderMax(currency: Currency): number {
  return currency === 'JPY' ? 1_000_000 : 10_000
}
