"use client"

import { useEffect, useRef } from "react"
import type { BlockComponentProps, ListData, ListItem } from "../types"
import { generateBlockId } from "../types"
import { BlockSettings } from "../BlockSettings"
import { ColorField, AlignPills } from "../settings-controls"

function ListItemEditor({ item, onChange }: { item: ListItem; onChange: (content: string) => void }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== item.content) {
      ref.current.innerHTML = item.content
    }
  }, [])

  return (
    <div
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      className="nl-list-item-text"
      data-placeholder="List item"
      onInput={() => ref.current && onChange(ref.current.innerHTML)}
    />
  )
}

export function ListBlock({ block, onUpdate, isSelected, onSelect }: BlockComponentProps<ListData>) {
  const data = block.data
  const Tag = data.style === "number" ? "ol" : "ul"

  const updateItem = (id: string, content: string) => {
    onUpdate({ items: data.items.map((item) => (item.id === id ? { ...item, content } : item)) })
  }

  return (
    <div onClick={onSelect}>
      <div className="nl-list-block" style={{ textAlign: data.alignment || "left" }}>
        <Tag style={{ ["--nl-marker" as string]: data.markerColor }}>
          {data.items.map((item) => (
            <li key={item.id}>
              <ListItemEditor item={item} onChange={(content) => updateItem(item.id, content)} />
            </li>
          ))}
        </Tag>
      </div>
      <BlockSettings active={isSelected}>
        <div className="nl-block-settings">
          <div className="nl-block-settings-row">
            <span className="nl-settings-label">Style</span>
            <div className="nl-pill-group">
              {(["bullet", "number"] as const).map((style) => (
                <button
                  key={style}
                  type="button"
                  className={`nl-pill ${data.style === style ? "nl-pill-active" : ""}`}
                  onClick={() => onUpdate({ style })}
                >
                  {style === "bullet" ? "Bullets" : "Numbers"}
                </button>
              ))}
            </div>
            <ColorField label="Marker" value={data.markerColor} onChange={(markerColor) => onUpdate({ markerColor })} />
            <AlignPills value={data.alignment || "left"} onChange={(alignment) => onUpdate({ alignment })} />
            <button
              type="button"
              className="nl-pill"
              onClick={() => onUpdate({ items: [...data.items, { id: generateBlockId(), content: "New item" }] })}
            >
              Add item
            </button>
            {data.items.length > 1 ? (
              <button
                type="button"
                className="nl-pill"
                onClick={() => onUpdate({ items: data.items.slice(0, -1) })}
              >
                Remove last
              </button>
            ) : null}
          </div>
        </div>
      </BlockSettings>
    </div>
  )
}
