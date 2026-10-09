"use client"

import type { BlockComponentProps, SpacerData } from "../types"
import { BlockSettings } from "../BlockSettings"

const SPACER_OPTIONS = [8, 12, 16, 24, 32] as const

export function SpacerBlock({ block, onUpdate, isSelected, onSelect }: BlockComponentProps<SpacerData>) {
  return (
    <div onClick={onSelect}>
      <div className="nl-spacer-block" style={{ height: `${block.data.height}px` }} data-height={`${block.data.height}px`} />
      <BlockSettings active={isSelected}>
        <div className="nl-block-settings">
          <div className="nl-block-settings-row">
            <span className="nl-settings-label">Height</span>
            <div className="nl-pill-group">
              {SPACER_OPTIONS.map((height) => (
                <button
                  key={height}
                  type="button"
                  className={`nl-pill ${block.data.height === height ? "nl-pill-active" : ""}`}
                  onClick={() => onUpdate({ height })}
                >
                  {height}
                </button>
              ))}
            </div>
          </div>
        </div>
      </BlockSettings>
    </div>
  )
}
