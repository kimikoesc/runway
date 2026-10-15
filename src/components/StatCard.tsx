// StatCard is one box in the stats row: a label above a value.
import type { ReactNode } from 'react'

type Props = {
  label: string
  value?: string
  children?: ReactNode
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
