"use client"

import { FilePlus2, Mail } from "lucide-react"
import { BLOCK_META, type BlockType } from "../core/types"
import { BLOCK_ICONS } from "../blocks/icons"
import { PRESET_LIST, type PresetId } from "../core/presets"
import { AddBlockMenu } from "./AddBlockMenu"

const STARTERS: BlockType[] = ["logo", "heading", "text", "button"]

export function EmptyCanvas({
  onAdd,
  onPick,
}: {
  onAdd: (type: BlockType) => void
  onPick: (id: PresetId) => void
}) {
  return (
    <div className="nl-empty-state">
      <div className="nl-empty-state-icon">
        <Mail size={20} />
      </div>
      <h3>Start from scratch</h3>
      <p>Add blocks yourself, or drop in a layout. Everything shares the same type, color, and alignment.</p>
      <div className="nl-empty-starters">
        {STARTERS.map((type) => {
          const Icon = BLOCK_ICONS[type]
          return (
            <button key={type} type="button" className="nl-starter-chip" onClick={() => onAdd(type)}>
              <Icon size={14} />
              {BLOCK_META[type].label}
            </button>
          )
        })}
      </div>
      <div className="nl-empty-add">
        <AddBlockMenu onAdd={onAdd} alwaysVisible />
      </div>
      <div className="nl-layout-picker">
        <p className="nl-layout-kicker">
          <FilePlus2 size={11} /> Or start from a layout
        </p>
        <div className="nl-layout-grid">
          {PRESET_LIST.map((preset) => (
            <button key={preset.id} type="button" className="nl-layout-card" onClick={() => onPick(preset.id)}>
              <span>{preset.name}</span>
              <small>{preset.detail}</small>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
