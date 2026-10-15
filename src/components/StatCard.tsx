// StatCard is one box in the stats row: a label above a value.
import type { ReactNode } from 'react'

// Props: label, value text, or `children` to put something else (like an input) in the value's place.
type Props = {
  label: string
  value?: string
  children?: ReactNode // Svelte: <slot />
}

// StatCard() renders the box.
export default function StatCard({ label, value, children }: Props) {
  return (
    <div className="stat-card">
      <span className="stat-label">{label}</span>
      {children ?? <strong className="stat-value">{value}</strong>}
    </div>
  )
}
