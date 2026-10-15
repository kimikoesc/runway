// MoneyInput is a number field with the currency symbol in front.
import { useState } from 'react'
import type { Currency } from '../types'
import { currencySymbol } from '../lib/format'

// Props: the amount, which currency symbol to show, an accessible label, and a change callback.
type Props = {
  value: number
  currency: Currency
  label: string
  onChange: (value: number) => void
}

// toAmount() turns typed text into a safe number: commas ignored, junk/negative become 0.
function toAmount(text: string): number {
  const n = Number(text.replace(/,/g, ''))
  return Number.isFinite(n) && n > 0 ? n : 0
}

// MoneyInput() keeps the raw text while typing (so "12." isn't cut to "12") and reports the number.
export default function MoneyInput({ value, currency, label, onChange }: Props) {
  // draft is the text being typed; null when not focused so the field shows the saved value.
  const [draft, setDraft] = useState<string | null>(null)

  return (
    <label className="money-input">
      <span className="money-symbol">{currencySymbol(currency)}</span>
      <input
        type="text"
        inputMode="decimal" // number keypad on phones
        aria-label={label}
        placeholder="0"
        value={draft ?? (value ? value.toLocaleString('en-US') : '')} // 2200000 shows as 2,200,000
        onChange={(e) => {
          setDraft(e.target.value)
          onChange(toAmount(e.target.value))
        }}
        onBlur={() => setDraft(null)}
      />
    </label>
  )
}
