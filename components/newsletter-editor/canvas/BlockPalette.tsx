"use client"

import { BLOCK_CATEGORIES, BLOCK_META, BLOCK_ORDER, type BlockType } from "../core/types"
import { BLOCK_ICONS } from "../blocks/icons"

export function BlockPalette({ onAdd }: { onAdd: (type: BlockType) => void }) {
  return (
    <aside className="nl-palette">
      <div className="nl-palette-head">
        <strong>Blocks</strong>
        <span>Click to add</span>
      </div>
      <div className="nl-palette-body">
        {BLOCK_CATEGORIES.map((category) => {
          const items = BLOCK_ORDER.filter((type) => BLOCK_META[type].category === category.id)
          return (
            <section key={category.id} className="nl-palette-section">
              <h4>{category.label}</h4>
              <div className="nl-palette-grid">
                {items.map((type) => {
                  const Icon = BLOCK_ICONS[type]
                  const meta = BLOCK_META[type]
                  return (
                    <button
                      key={type}
                      type="button"
                      className="nl-palette-item"
                      title={meta.description}
                      onClick={() => onAdd(type)}
                    >
                      <Icon size={15} />
                      <span>{meta.label}</span>
                    </button>
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>
    </aside>
  )
}
