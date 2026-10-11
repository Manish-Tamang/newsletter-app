"use client"

import { useEffect, useRef, useState } from "react"
import { FilePlus2, LayoutTemplate } from "lucide-react"
import { PRESET_LIST, type PresetId } from "../core/presets"

export function LayoutPicker({
  onPick,
  onBlank,
}: {
  onPick: (id: PresetId) => void
  onBlank: () => void
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onPointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", onPointer)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onPointer)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  return (
    <div className="nl-layout-menu" ref={rootRef}>
      <button type="button" className="nl-layout-trigger" onClick={() => setOpen((value) => !value)}>
        <LayoutTemplate size={14} />
        Layouts
      </button>
      {open ? (
        <div className="nl-layout-popover">
          <button
            type="button"
            onClick={() => {
              onBlank()
              setOpen(false)
            }}
          >
            <strong>
              <FilePlus2 size={12} /> From scratch
            </strong>
            <span>Empty canvas. Add blocks yourself.</span>
          </button>
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
      ) : null}
    </div>
  )
}
