// Slider is a reusable range input. The parent owns the value and gets told about changes.
import type { CSSProperties } from 'react'

type Props = {
  value: number
  min: number
  max: number
  step: number
  label: string // accessible name for screen readers and tests
  onChange: (value: number) => void
}

// Slider() renders the range input; values above max just park the thumb at the end.
export default function Slider({ value, min, max, step, label, onChange }: Props) {
  const shown = Math.min(value, max)
  // --fill tells the CSS how much of the track to paint orange (browsers don't style the filled part on their own).
  const fill = `${((shown - min) / (max - min)) * 100}%`

  return (
    <input
      className="slider"
      type="range"
      aria-label={label}
      min={min}
      max={max}
      step={step}
      value={shown}
      style={{ '--fill': fill } as CSSProperties}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  )
}
