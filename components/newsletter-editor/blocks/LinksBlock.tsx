"use client"

import type { BlockComponentProps, LinksData } from "../types"
import { generateBlockId } from "../types"
import { BlockSettings } from "../BlockSettings"
import { AlignPills } from "../settings-controls"

export function LinksBlock({ block, onUpdate, isSelected, onSelect }: BlockComponentProps<LinksData>) {
  const data = block.data

  const updateItem = (id: string, patch: { label?: string; url?: string }) => {
    onUpdate({
      items: data.items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    })
  }

  return (
    <div onClick={onSelect}>
      <p className="nl-links" style={{ textAlign: data.alignment }}>
        {data.items.map((item, index) => (
          <span key={item.id}>
            {index > 0 ? <span className="nl-links-sep">|</span> : null}
            <span className="nl-links-item">{item.label || "Link"}</span>
          </span>
        ))}
      </p>
      <BlockSettings active={isSelected}>
        <div className="nl-block-settings">
          <div className="nl-block-settings-row">
            <AlignPills value={data.alignment} onChange={(alignment) => onUpdate({ alignment })} />
            <button
              type="button"
              className="nl-pill"
              onClick={() =>
                onUpdate({ items: [...data.items, { id: generateBlockId(), label: "Link", url: "https://" }] })
              }
            >
              Add link
            </button>
          </div>
          {data.items.map((item) => (
            <div key={item.id} className="nl-block-settings-row">
              <input
                className="nl-settings-input"
                value={item.label}
                onChange={(e) => updateItem(item.id, { label: e.target.value })}
                placeholder="Label"
              />
              <input
                className="nl-settings-input"
                value={item.url}
                onChange={(e) => updateItem(item.id, { url: e.target.value })}
                placeholder="https://"
              />
              <button
                type="button"
                className="nl-pill"
                onClick={() => onUpdate({ items: data.items.filter((entry) => entry.id !== item.id) })}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </BlockSettings>
    </div>
  )
}
