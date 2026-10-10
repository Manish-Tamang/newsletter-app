"use client"

import { BLOCK_META, type BlockData, type NewsletterBlock } from "../core/types"
import type { EmailTheme } from "../core/theme"
import type { BlockUpdater } from "../core/types"
import { BlockInspector } from "./BlockInspector"
import { CanvasSettings } from "./CanvasSettings"
import type { InspectorTab } from "./inspector-context"

export function InspectorPanel({
  tab,
  onTabChange,
  theme,
  selected,
  onThemeChange,
  onUpdateBlock,
}: {
  tab: InspectorTab
  onTabChange: (tab: InspectorTab) => void
  theme: EmailTheme
  selected: NewsletterBlock | null
  onThemeChange: (patch: Partial<EmailTheme>) => void
  onUpdateBlock: BlockUpdater<BlockData>
}) {
  return (
    <aside className="nl-inspector">
      <div className="nl-inspector-bar" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "email"}
          className={tab === "email" ? "nl-active" : ""}
          onClick={() => onTabChange("email")}
        >
          Email
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "block"}
          className={tab === "block" ? "nl-active" : ""}
          onClick={() => onTabChange("block")}
          disabled={!selected}
        >
          {selected ? BLOCK_META[selected.type].label : "Block"}
        </button>
      </div>
      <div className="nl-inspector-body">
        {tab === "email" ? <CanvasSettings theme={theme} onChange={onThemeChange} /> : null}
        {tab === "block" && selected ? (
          <BlockInspector block={selected} theme={theme} onUpdate={onUpdateBlock} />
        ) : null}
        {tab === "block" && !selected ? (
          <p className="nl-inspector-empty">Select a block on the canvas to edit its settings.</p>
        ) : null}
      </div>
    </aside>
  )
}
