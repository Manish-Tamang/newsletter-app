"use client"

import { useEffect, useState } from "react"
import { RotateCcw } from "lucide-react"

const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i

function normalizeHex(input: string): string | null {
  let value = input.trim()
  if (!value.startsWith("#")) value = `#${value}`
  if (!HEX.test(value)) return null
  if (value.length === 4) {
    value = `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`
  }
  return value.toLowerCase()
}

export function ColorField({
  label,
  value,
  fallback,
  onChange,
  onReset,
  presets,
}: {
  label: string
  value: string
  fallback?: string
  onChange: (value: string) => void
  onReset?: () => void
  presets?: string[]
}) {
  const resolved = value || fallback || "#000000"
  const [text, setText] = useState(resolved)

  useEffect(() => {
    setText(resolved)
  }, [resolved])

  const commitText = () => {
    const next = normalizeHex(text)
    if (next) onChange(next)
    else setText(resolved)
  }

  return (
    <div className="nl-field">
      <div className="nl-field-head">
        <span className="nl-field-label">{label}</span>
        {onReset && value ? (
          <button type="button" className="nl-field-action" onClick={onReset} title="Use theme default">
            <RotateCcw size={11} />
            Default
          </button>
        ) : null}
      </div>
      <div className="nl-color-control">
        <label className="nl-color-swatch" style={{ backgroundColor: resolved }} title="Pick a color">
          <input type="color" value={resolved} onChange={(event) => onChange(event.target.value)} aria-label={`${label} color`} />
        </label>
        <input
          className="nl-input nl-input-mono"
          value={text}
          onChange={(event) => setText(event.target.value)}
          onBlur={commitText}
          onKeyDown={(event) => {
            if (event.key === "Enter") (event.target as HTMLInputElement).blur()
          }}
          spellCheck={false}
          aria-label={`${label} hex`}
        />
      </div>
      {presets && presets.length > 0 ? (
        <div className="nl-swatch-row">
          {presets.map((swatch) => (
            <button
              key={swatch}
              type="button"
              className={`nl-swatch ${resolved.toLowerCase() === swatch.toLowerCase() ? "nl-is-active" : ""}`}
              style={{ backgroundColor: swatch }}
              onClick={() => onChange(swatch)}
              title={swatch}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
