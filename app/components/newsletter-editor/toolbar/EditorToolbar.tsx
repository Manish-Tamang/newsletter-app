"use client"

import { Eye, Maximize2, Minimize2 } from "lucide-react"
import type { Align, NewsletterBlock } from "../core/types"
import { blockAlignment } from "../core/document"
import type { SaveStatus } from "../hooks/useEditorDocument"
import type { PresetId } from "../core/presets"
import { AlignmentTools } from "./AlignmentTools"
import { FormatTools } from "./FormatTools"
import { HistoryTools } from "./HistoryTools"
import { LayoutPicker } from "./LayoutPicker"
import { ObjectTools } from "./ObjectTools"
import { ToolbarButton, ToolbarGroup, ToolbarSeparator } from "./ToolbarGroup"

export function EditorToolbar({
  isFullscreen,
  onToggleFullscreen,
  onAlign,
  emailAlign,
  selected,
  isFirst,
  isLast,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
  onPreview,
  onPickLayout,
  onBlank,
  saveStatus,
}: {
  isFullscreen: boolean
  onToggleFullscreen: () => void
  onAlign: (align: Align) => void
  emailAlign: Align
  selected: NewsletterBlock | null
  isFirst: boolean
  isLast: boolean
  canUndo: boolean
  canRedo: boolean
  onUndo: () => void
  onRedo: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  onDuplicate: () => void
  onDelete: () => void
  onPreview: () => void
  onPickLayout: (id: PresetId) => void
  onBlank: () => void
  saveStatus: SaveStatus
}) {
  const selectedAlign = blockAlignment(selected)
  const alignScope = selectedAlign ? "block" : "email"
  const alignValue = selectedAlign ?? emailAlign

  return (
    <div className="nl-toolbar">
      <HistoryTools canUndo={canUndo} canRedo={canRedo} onUndo={onUndo} onRedo={onRedo} />
      <ToolbarSeparator />
      <FormatTools />
      <ToolbarSeparator />
      <AlignmentTools value={alignValue} scope={alignScope} onChange={onAlign} />
      <ToolbarSeparator />
      <ObjectTools
        disabled={!selected}
        isFirst={isFirst}
        isLast={isLast}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        onDuplicate={onDuplicate}
        onDelete={onDelete}
      />
      <div className="nl-toolbar-end">
        <span className={`nl-save-status nl-save-${saveStatus}`}>
          {saveStatus === "saved" ? "Saved" : saveStatus === "dirty" ? "Saving" : ""}
        </span>
        <LayoutPicker onPick={onPickLayout} onBlank={onBlank} />
        <ToolbarGroup label="View">
          <ToolbarButton title="Preview" onClick={onPreview}>
            <Eye size={15} />
          </ToolbarButton>
          <ToolbarButton
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            onClick={onToggleFullscreen}
          >
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </ToolbarButton>
        </ToolbarGroup>
      </div>
    </div>
  )
}
