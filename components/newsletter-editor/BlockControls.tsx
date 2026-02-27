"use client"

import { GripVertical, Trash2, Copy, ChevronUp, ChevronDown } from "lucide-react"

interface BlockControlsProps {
  onMoveUp: () => void
  onMoveDown: () => void
  onDuplicate: () => void
  onDelete: () => void
  isFirst: boolean
  isLast: boolean
}

export function BlockControls({ onMoveUp, onMoveDown, onDuplicate, onDelete, isFirst, isLast }: BlockControlsProps) {
  return (
    <div className="nl-block-controls">
      <button className="nl-block-control-btn" title="Drag to reorder" style={{ cursor: "grab" }}>
        <GripVertical size={14} />
      </button>
      {!isFirst && (
        <button className="nl-block-control-btn" onClick={onMoveUp} title="Move up">
          <ChevronUp size={14} />
        </button>
      )}
      {!isLast && (
        <button className="nl-block-control-btn" onClick={onMoveDown} title="Move down">
          <ChevronDown size={14} />
        </button>
      )}
      <button className="nl-block-control-btn" onClick={onDuplicate} title="Duplicate">
        <Copy size={14} />
      </button>
      <button className="nl-block-control-btn nl-danger" onClick={onDelete} title="Delete">
        <Trash2 size={14} />
      </button>
    </div>
  )
}
