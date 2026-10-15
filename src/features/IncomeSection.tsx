// IncomeSection lists the income sources: rename, set the amount with a slider or by typing, add, delete.
import { runwayStore, useRunway } from '../store/runwayStore'
import { sliderMax } from '../lib/format'
import Section from '../components/Section'
import IconButton from '../components/IconButton'
import EditableText from '../components/EditableText'
import Slider from '../components/Slider'
import MoneyInput from '../components/MoneyInput'

// IncomeSection() renders one row per income source.
export default function IncomeSection() {
  const { incomes, currency } = useRunway()
  const max = sliderMax(currency)
  const onlyOne = incomes.length === 1 // the last source can't be deleted

  return (
    <Section
      title="Sources of income"
      action={<IconButton icon="+" label="Add income source" onClick={runwayStore.addIncome} />}
    >
      {incomes.map((income) => (
        <div className="row income-row" key={income.id}>
          <div className="row-main">
            <EditableText
              label={`Rename ${income.name}`}
              value={income.name}
              onChange={(name) => runwayStore.updateIncome(income.id, { name })}
            />
            <MoneyInput
              label={`${income.name} amount`}
              value={income.amount}
              currency={currency}
              onChange={(amount) => runwayStore.updateIncome(income.id, { amount })}
            />
            <IconButton
              icon="×"
              label={`Delete ${income.name}`}
              onClick={() => runwayStore.removeIncome(income.id)}
              disabled={onlyOne}
            />
          </div>
          <Slider
            label={`${income.name} slider`}
            value={income.amount}
            min={0}
            max={max}
            step={max / 1000}
            onChange={(amount) => runwayStore.updateIncome(income.id, { amount })}
          />
        </div>
      ))}
    </Section>
  )
}
