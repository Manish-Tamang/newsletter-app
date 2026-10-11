"use client"

import { BLOCK_META, type BlockData, type NewsletterBlock } from "../core/types"
import type { EmailTheme } from "../core/theme"
import type { BlockUpdater } from "../core/types"
import { renderBlockSettings } from "./settings-registry"

export function BlockInspector({
  block,
  theme,
  onUpdate,
}: {
  block: NewsletterBlock
  theme: EmailTheme
  onUpdate: BlockUpdater<BlockData>
}) {
  const meta = BLOCK_META[block.type]
  return (
    <div className="nl-inspector-stack">
      <div className="nl-inspector-lead">
        <strong>{meta.label}</strong>
        <span>{meta.description}</span>
      </div>
      {renderBlockSettings({ block, theme, onUpdate })}
    </div>
  )
}
