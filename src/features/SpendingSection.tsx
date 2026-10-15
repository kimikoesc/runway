// SpendingSection lists monthly expenses: check/uncheck to include, rename, set amount, add, delete.
import { runwayStore, useRunway } from '../store/runwayStore'
import Section from '../components/Section'
import IconButton from '../components/IconButton'
import EditableText from '../components/EditableText'
import MoneyInput from '../components/MoneyInput'
import Checkbox from '../components/Checkbox'

// SpendingSection() renders one row per expense; unchecked rows are dimmed.
export default function SpendingSection() {
  const { expenses, currency } = useRunway()

  return (
    <Section title="Spending" action={<IconButton icon="+" label="Add expense" onClick={runwayStore.addExpense} />}>
      {expenses.map((expense) => (
        // className is React's `class` (class is a reserved word in JavaScript).
        <div className={`row expense-row${expense.enabled ? '' : ' is-off'}`} key={expense.id}>
          <Checkbox
            label={`Include ${expense.name}`}
            checked={expense.enabled}
            onChange={() => runwayStore.toggleExpense(expense.id)}
          />
          <EditableText
            label={`Rename ${expense.name}`}
            value={expense.name}
            onChange={(name) => runwayStore.updateExpense(expense.id, { name })}
          />
          <MoneyInput
            label={`${expense.name} amount`}
            value={expense.amount}
            currency={currency}
            onChange={(amount) => runwayStore.updateExpense(expense.id, { amount })}
          />
          <IconButton icon="×" label={`Delete ${expense.name}`} onClick={() => runwayStore.removeExpense(expense.id)} />
        </div>
      ))}
    </Section>
  )
}
