// StatsRow is the row of four boxes: savings (editable), spending, income and net burn per month.
import { runwayStore, useRunway } from '../store/runwayStore'
import { totalIncome, totalSpending } from '../lib/runway'
import { formatMoney } from '../lib/format'
import StatCard from '../components/StatCard'
import MoneyInput from '../components/MoneyInput'

// StatsRow() shows the totals; savings is an input because this is where the user enters it.
export default function StatsRow() {
  const { savings, incomes, expenses, currency } = useRunway()
  const spending = totalSpending(expenses)
  const income = totalIncome(incomes)
  const netBurn = spending - income

  return (
    <div className="stats-row">
      <StatCard label="Savings">
        <MoneyInput label="Savings" value={savings} currency={currency} onChange={runwayStore.setSavings} />
      </StatCard>
      <StatCard label="Spending / month" value={formatMoney(spending, currency)} />
      <StatCard label="Income / month" value={formatMoney(income, currency)} />
      {netBurn > 0 ? (
        <StatCard label="Net burn / month" value={formatMoney(netBurn, currency)} />
      ) : (
        <StatCard label="Surplus / month" value={`+${formatMoney(-netBurn, currency)}`} />
      )}
    </div>
  )
}
