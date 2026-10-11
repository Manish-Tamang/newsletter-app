"use client"

import { Field } from "./Section"

export function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit = "px",
  slider = true,
}: {
  label: string
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step?: number
  unit?: string
  slider?: boolean
}) {
  const clamp = (next: number) => Math.min(max, Math.max(min, next))

  return (
    <Field
      label={label}
      trailing={
        <span className="nl-number-input">
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(event) => {
              const next = Number(event.target.value)
              if (!Number.isNaN(next)) onChange(clamp(next))
            }}
            aria-label={`${label} value`}
          />
          <span>{unit}</span>
        </span>
      }
    >
      {slider ? (
        <input
          type="range"
          className="nl-range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(clamp(Number(event.target.value)))}
          aria-label={label}
        />
      ) : null}
    </Field>
  )
}
