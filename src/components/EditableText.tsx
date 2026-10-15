// EditableText looks like plain text but is an input: click it to rename.
import { useState } from 'react'

// Props: the saved text, an accessible label, and a callback when a new name is saved.
type Props = {
  value: string
  label: string
  onChange: (value: string) => void
}

// EditableText() keeps a draft while typing and only saves on Enter or when focus leaves.
export default function EditableText({ value, label, onChange }: Props) {
  // useState is React's local component state (Svelte: a plain `let`).
  // draft is null when not editing, so the input shows the saved value.
  const [draft, setDraft] = useState<string | null>(null)

  // save() commits the draft; an empty name is ignored so items never lose their name.
  function save() {
    const name = draft?.trim()
    if (name && name !== value) onChange(name)
    setDraft(null)
  }

  return (
    <input
      className="editable-text"
      aria-label={label}
      value={draft ?? value}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={save}
      onKeyDown={(e) => {
        if (e.key === 'Enter') save()
        if (e.key === 'Escape') setDraft(null)
      }}
    />
  )
}
