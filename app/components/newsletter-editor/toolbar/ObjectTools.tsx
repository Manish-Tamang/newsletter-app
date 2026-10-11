"use client"

import { ChevronDown, ChevronUp, Copy, Trash2 } from "lucide-react"
import { ToolbarButton, ToolbarGroup } from "./ToolbarGroup"

export function ObjectTools({
  disabled,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
}: {
  disabled?: boolean
  isFirst?: boolean
  isLast?: boolean
  onMoveUp: () => void
  onMoveDown: () => void
  onDuplicate: () => void
  onDelete: () => void
}) {
  return (
    <ToolbarGroup label="Object">
      <ToolbarButton title="Move up" disabled={disabled || isFirst} onClick={onMoveUp}>
        <ChevronUp size={15} />
      </ToolbarButton>
      <ToolbarButton title="Move down" disabled={disabled || isLast} onClick={onMoveDown}>
        <ChevronDown size={15} />
      </ToolbarButton>
      <ToolbarButton title="Duplicate" disabled={disabled} onClick={onDuplicate}>
        <Copy size={15} />
      </ToolbarButton>
      <ToolbarButton title="Delete" disabled={disabled} danger onClick={onDelete}>
        <Trash2 size={15} />
      </ToolbarButton>
    </ToolbarGroup>
  )
}
