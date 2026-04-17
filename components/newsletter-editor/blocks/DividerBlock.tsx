"use client"

import type { BlockComponentProps, DividerData } from "../types"

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
      {isSelected && (
        <div className="nl-block-settings">
          <div className="nl-block-settings-row">
            <span className="nl-settings-label">Style</span>
            <div className="nl-pill-group">
              {(["solid", "dashed", "dotted"] as const).map((s) => (
                <button
                  key={s}
                  className={`nl-pill ${block.data.style === s ? "nl-pill-active" : ""}`}
                  onClick={() => onUpdate({ style: s })}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
            <div className="nl-toolbar-separator" />
            <span className="nl-settings-label">Color</span>
            <input
              type="color"
              value={block.data.color}
              onChange={(e) => onUpdate({ color: e.target.value })}
              className="nl-color-swatch"
              style={{ cursor: "pointer" }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
