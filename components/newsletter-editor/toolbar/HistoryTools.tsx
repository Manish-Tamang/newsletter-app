"use client"

import { Redo2, Undo2 } from "lucide-react"
import { ToolbarButton, ToolbarGroup } from "./ToolbarGroup"

export function HistoryTools({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
}: {
  canUndo: boolean
  canRedo: boolean
  onUndo: () => void
  onRedo: () => void
}) {
  return (
    <ToolbarGroup label="History">
      <ToolbarButton title="Undo" disabled={!canUndo} onClick={onUndo}>
        <Undo2 size={15} />
      </ToolbarButton>
      <ToolbarButton title="Redo" disabled={!canRedo} onClick={onRedo}>
        <Redo2 size={15} />
      </ToolbarButton>
    </ToolbarGroup>
  )
}
