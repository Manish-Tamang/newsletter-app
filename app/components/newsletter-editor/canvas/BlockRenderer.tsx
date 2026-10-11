"use client"

import { ChevronDown, ChevronUp, Copy, Trash2 } from "lucide-react"
import type { BlockData, BlockType, NewsletterBlock } from "../core/types"
import { BLOCK_META } from "../core/types"
import type { BlockUpdater } from "../core/types"
import { stackSpace } from "../core/stack"
import { renderBlockContent } from "../blocks/registry"

export function BlockRenderer({
  block,
  previousType,
  isSelected,
  isFirst,
  isLast,
  onSelect,
  onUpdate,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
}: {
  block: NewsletterBlock
  previousType: BlockType | null
  isSelected: boolean
  isFirst: boolean
  isLast: boolean
  onSelect: (id: string) => void
  onUpdate: BlockUpdater<BlockData>
  onDelete: (id: string) => void
  onDuplicate: (id: string) => void
  onMoveUp: (id: string) => void
  onMoveDown: (id: string) => void
}) {
  const space = stackSpace(block.type, previousType)

  return (
    <div
      className={`nl-block-wrapper ${isSelected ? "nl-block-selected" : ""}`}
      onMouseDown={(event) => {
        event.stopPropagation()
        onSelect(block.id)
      }}
    >
      <div className="nl-block-controls">
        <button type="button" className="nl-block-control-btn" title="Move up" disabled={isFirst} onClick={() => onMoveUp(block.id)}>
          <ChevronUp size={13} />
        </button>
        <button type="button" className="nl-block-control-btn" title="Move down" disabled={isLast} onClick={() => onMoveDown(block.id)}>
          <ChevronDown size={13} />
        </button>
        <button type="button" className="nl-block-control-btn" title="Duplicate" onClick={() => onDuplicate(block.id)}>
          <Copy size={13} />
        </button>
        <button type="button" className="nl-block-control-btn nl-danger" title="Delete" onClick={() => onDelete(block.id)}>
          <Trash2 size={13} />
        </button>
      </div>
      {isSelected ? <span className="nl-block-chip">{BLOCK_META[block.type].label}</span> : null}
      <div
        className="nl-block-inner"
        style={{ paddingTop: space.top, paddingBottom: space.bottom, paddingLeft: "var(--nl-pad-x)", paddingRight: "var(--nl-pad-x)" }}
      >
        {renderBlockContent({
          block,
          isSelected,
          onUpdate: (data, options) => onUpdate(data, options),
        })}
      </div>
    </div>
  )
}
