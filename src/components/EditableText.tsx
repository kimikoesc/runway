import { useState } from 'react'

type Props = {
  value: string
  label: string
  onChange: (value: string) => void
}

// EditableText() keeps a draft while typing and only saves on Enter or when focus leaves.
export default function EditableText({ value, label, onChange }: Props) {
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
