"use client"

import { useEffect, useState, type ReactNode } from "react"
import { createPortal } from "react-dom"
import { useInspectorTab } from "./inspector-context"

export function BlockSettings({ active, children }: { active: boolean; children: ReactNode }) {
  const tab = useInspectorTab()
  const [slot, setSlot] = useState<HTMLElement | null>(null)

  useEffect(() => {
    setSlot(document.getElementById("nl-inspector-slot"))
  }, [active, tab])

  if (!active || tab !== "block" || !slot) return null
  return createPortal(<div className="nl-inspector-fields">{children}</div>, slot)
}
