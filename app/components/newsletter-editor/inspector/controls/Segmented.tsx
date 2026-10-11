"use client"

import type { ReactNode } from "react"

export interface SegmentedOption<T extends string | number> {
  value: T
  label: ReactNode
  title?: string
}

export function Segmented<T extends string | number>({
  value,
  options,
  onChange,
  ariaLabel,
  size = "md",
}: {
  value: T
  options: SegmentedOption<T>[]
  onChange: (value: T) => void
  ariaLabel?: string
  size?: "sm" | "md"
}) {
  return (
    <div className={`nl-segmented nl-segmented-${size}`} role="radiogroup" aria-label={ariaLabel}>
      {options.map((option) => {
        const active = option.value === value
        return (
          <button
            key={String(option.value)}
            type="button"
            role="radio"
            aria-checked={active}
            title={option.title}
            className={`nl-segment ${active ? "nl-is-active" : ""}`}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
