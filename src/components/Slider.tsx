// Slider is a reusable range input. The parent owns the value and gets told about changes.
// Svelte: `export let value` + `bind:value`. React has no two-way binding: pass `value` down, get changes via `onChange`.

// Props lists what the parent passes in (Svelte: the component's `export let` lines).
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
  return (
    <input
      className="slider"
      type="range"
      aria-label={label}
      min={min}
      max={max}
      step={step}
      value={Math.min(value, max)}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  )
}
