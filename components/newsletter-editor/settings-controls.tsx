"use client"

import type { Align } from "./types"

export function AlignPills({ value, onChange }: { value: Align; onChange: (value: Align) => void }) {
  return (
    <>
      <span className="nl-settings-label">Align</span>
      <div className="nl-pill-group">
        {(["left", "center", "right"] as const).map((alignment) => (
          <button
            key={alignment}
            type="button"
            className={`nl-pill ${value === alignment ? "nl-pill-active" : ""}`}
            onClick={() => onChange(alignment)}
          >
            {alignment.charAt(0).toUpperCase() + alignment.slice(1)}
          </button>
        ))}
      </div>
    </>
  )
}

export function ColorField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <label className="nl-color-field">
      <span>{label}</span>
      <input type="color" value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  )
}
