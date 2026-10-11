"use client"

import { generateBlockId, type LinksData } from "../../core/types"
import { AlignField, Section, TextField } from "../controls"
import type { BlockSettingsProps } from "./types"

export function LinksSettings({ block, onUpdate }: BlockSettingsProps<LinksData>) {
  const data = block.data

  const updateItem = (id: string, patch: Partial<LinksData["items"][number]>) => {
    onUpdate({ items: data.items.map((item) => (item.id === id ? { ...item, ...patch } : item)) }, { typing: true })
  }

  const removeItem = (id: string) => {
    if (data.items.length <= 1) return
    onUpdate({ items: data.items.filter((item) => item.id !== id) })
  }

  return (
    <>
      <Section
        title="Links"
        action={
          <button
            type="button"
            className="nl-field-action"
            onClick={() =>
              onUpdate({
                items: [...data.items, { id: generateBlockId(), label: "Link", url: "" }],
              })
            }
          >
            Add
          </button>
        }
      >
        {data.items.map((item, index) => (
          <div key={item.id} className="nl-repeater-item">
            <div className="nl-repeater-head">
              <span>Link {index + 1}</span>
              {data.items.length > 1 ? (
                <button type="button" className="nl-field-action" onClick={() => removeItem(item.id)}>
                  Remove
                </button>
              ) : null}
            </div>
            <TextField label="Label" value={item.label} onChange={(label) => updateItem(item.id, { label })} />
            <TextField label="URL" type="url" value={item.url} placeholder="https://" onChange={(url) => updateItem(item.id, { url })} />
          </div>
        ))}
        <AlignField value={data.alignment} onChange={(alignment) => onUpdate({ alignment })} />
      </Section>
    </>
  )
}
