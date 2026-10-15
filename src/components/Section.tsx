// Section is a card with a title row (title left, optional action like a + button right) and content below.
import type { ReactNode } from 'react'

type Props = {
  title: string
  action?: ReactNode
  children: ReactNode
}

// Section() renders the card.
export default function Section({ title, action, children }: Props) {
  return (
    <section className="section">
      <header className="section-header">
        <h2>{title}</h2>
        {action}
      </header>
      {children}
    </section>
  )
}
