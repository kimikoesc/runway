// RunwayHeader is the top of the page: how many months savings last, a one-line explanation, and the chart.
import { useRunway } from '../store/runwayStore'
import { runOutDate, runwayMonths, totalIncome, totalSpending } from '../lib/runway'
import { formatMoney, formatMonthYear } from '../lib/format'
import RunwayChart from '../components/RunwayChart'

// RunwayHeader() works out the numbers from the store and shows them.
export default function RunwayHeader() {
  const { savings, incomes, expenses, currency } = useRunway()

  // Derived values: plain variables recalculated on every render (Svelte: `$: spending = ...`).
  const spending = totalSpending(expenses)
  const income = totalIncome(incomes)
  const netBurn = spending - income
  const months = runwayMonths(savings, netBurn)
  const isInfinite = months === Infinity
  // Past 100 years a date is meaningless (and past ~275,000 years JavaScript can't even make one).
  const isOver100Years = !isInfinite && months > 1200
  const totals = `spending ${formatMoney(spending, currency)} and earning ${formatMoney(income, currency)} a month.`

  return (
    <section className="runway-header">
      <p className="runway-months">
        {isInfinite ? '∞' : isOver100Years ? '100+ years' : `${months.toFixed(1)} months`}
      </p>
      <p className="runway-sentence">
        {isInfinite
          ? 'Your income covers your spending — savings never run out.'
          : isOver100Years
            ? `Savings last over 100 years, ${totals}`
            : `Savings last until about ${formatMonthYear(runOutDate(new Date(), months))}, ${totals}`}
      </p>
      <RunwayChart savings={savings} netBurn={netBurn} currency={currency} />
    </section>
  )
}
