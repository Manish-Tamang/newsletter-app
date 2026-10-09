"use client"

import { useEffect, useRef, useState } from "react"
import { LayoutTemplate } from "lucide-react"
import { PRESET_LIST, type PresetId } from "./presets"

export function LayoutPicker({
  onPick,
  variant,
}: {
  onPick: (id: PresetId) => void
  variant: "empty" | "toolbar"
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const close = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", close)
    return () => document.removeEventListener("mousedown", close)
  }, [open])

  if (variant === "empty") {
    return (
      <div className="nl-layout-picker">
        <p className="nl-layout-kicker">Start from a layout</p>
        <div className="nl-layout-grid">
          {PRESET_LIST.map((preset) => (
            <button key={preset.id} type="button" className="nl-layout-card" onClick={() => onPick(preset.id)}>
              <span>{preset.name}</span>
              <small>{preset.detail}</small>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="nl-layout-menu" ref={ref}>
      <button type="button" className="nl-layout-trigger" onClick={() => setOpen((value) => !value)}>
        <LayoutTemplate size={14} />
        Layouts
      </button>
      {open && (
        <div className="nl-layout-popover">
          {PRESET_LIST.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => {
                onPick(preset.id)
                setOpen(false)
              }}
            >
              <strong>{preset.name}</strong>
              <span>{preset.detail}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
