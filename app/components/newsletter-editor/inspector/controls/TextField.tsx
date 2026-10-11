"use client"

import type { ReactNode } from "react"
import { Field } from "./Section"

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  hint,
  type = "text",
  trailing,
  multiline,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  hint?: string
  type?: "text" | "url"
  trailing?: ReactNode
  multiline?: boolean
}) {
  return (
    <Field label={label} hint={hint} trailing={trailing}>
      {multiline ? (
        <textarea
          className="nl-input nl-textarea"
          value={value}
          rows={3}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          className="nl-input"
          type={type}
          value={value}
          placeholder={placeholder}
          spellCheck={type !== "url"}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </Field>
  )
}
