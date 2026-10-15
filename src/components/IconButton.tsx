// IconButton is a small square button with a symbol, e.g. + to add or × to delete.

// Props: the symbol, an accessible label (symbols alone mean nothing to screen readers), click handler.
type Props = {
  icon: '+' | '×'
  label: string
  onClick: () => void
  disabled?: boolean
}

// IconButton() renders the button; `type="button"` stops it from submitting a form by accident.
export default function IconButton({ icon, label, onClick, disabled }: Props) {
  return (
    <button type="button" className="icon-button" aria-label={label} onClick={onClick} disabled={disabled}>
      <span aria-hidden="true">{icon}</span>
    </button>
  )
}
