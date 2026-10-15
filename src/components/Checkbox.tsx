// Checkbox is a reusable checkbox; the parent decides what checked means.

type Props = {
  checked: boolean
  label: string
  onChange: (checked: boolean) => void
}

// Checkbox() renders a styled native checkbox (native = keyboard and screen readers work for free).
export default function Checkbox({ checked, label, onChange }: Props) {
  return (
    <input
      className="checkbox"
      type="checkbox"
      aria-label={label}
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
    />
  )
}
