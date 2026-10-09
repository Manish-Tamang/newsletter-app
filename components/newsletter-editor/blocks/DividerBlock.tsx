"use client"

import type { BlockComponentProps, DividerData } from "../types"
import { BlockSettings } from "../BlockSettings"
import { ColorField } from "../settings-controls"

export function DividerBlock({ block, onUpdate, isSelected, onSelect }: BlockComponentProps<DividerData>) {
  return (
    <div onClick={onSelect}>
      <div className="nl-divider-block">
        <hr
          style={{
            margin: 0,
            border: "none",
            borderTop: `1px ${block.data.style} ${block.data.color}`,
          }}
        />
      </div>
      <BlockSettings active={isSelected}>
        <div className="nl-block-settings">
          <div className="nl-block-settings-row">
            <span className="nl-settings-label">Style</span>
            <div className="nl-pill-group">
              {(["solid", "dashed", "dotted"] as const).map((style) => (
                <button
                  key={style}
                  type="button"
                  className={`nl-pill ${block.data.style === style ? "nl-pill-active" : ""}`}
                  onClick={() => onUpdate({ style })}
                >
                  {style.charAt(0).toUpperCase() + style.slice(1)}
                </button>
              ))}
            </div>
            <ColorField label="Color" value={block.data.color} onChange={(color) => onUpdate({ color })} />
          </div>
        </div>
      </BlockSettings>
    </div>
  )
}
