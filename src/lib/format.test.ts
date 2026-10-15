import { currencySymbol, formatMoney, formatMonthYear, sliderMax } from './format'

it('formats yen without decimals', () => {
  expect(formatMoney(377251, 'JPY')).toBe('¥377,251')
})
it('formats dollars with cents', () => {
  expect(formatMoney(1234.5, 'USD')).toBe('$1,234.50')
})
it('formats month and year', () => {
  expect(formatMonthYear(new Date(2027, 6, 1))).toBe('July 2027')
})
it('caps the income slider per currency', () => {
  expect(sliderMax('JPY')).toBe(1000000)
  expect(sliderMax('USD')).toBe(10000)
})
it('gets the currency symbol', () => {
  expect(currencySymbol('JPY')).toBe('¥')
  expect(currencySymbol('PHP')).toBe('₱')
})
