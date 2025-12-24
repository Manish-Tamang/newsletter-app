"use client"

import type { BlockComponentProps, SpacerData } from "../types"

const SPACER_OPTIONS = [16, 32, 48, 64] as const

export function SpacerBlock({ block, onUpdate, isSelected, onSelect }: BlockComponentProps<SpacerData>) {
  return (
    <div onClick={onSelect}>
      <div
        className="nl-spacer-block"
        style={{ height: `${block.data.height}px` }}
        data-height={`${block.data.height}px`}
      />
      {isSelected && (
        <div className="nl-block-settings">
          <div className="nl-block-settings-row">
            <span className="nl-settings-label">Height</span>
            <div className="nl-pill-group">
              {SPACER_OPTIONS.map((h) => (
                <button
                  key={h}
                  className={`nl-pill ${block.data.height === h ? "nl-pill-active" : ""}`}
                  onClick={() => onUpdate({ height: h })}
                >
                  {h}px
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
