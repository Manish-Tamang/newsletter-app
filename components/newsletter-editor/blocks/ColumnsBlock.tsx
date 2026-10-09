"use client"

import { useEffect, useRef } from "react"
import type { BlockComponentProps, ColumnsData } from "../types"
import { BlockSettings } from "../BlockSettings"

export function ColumnsBlock({ block, onUpdate, isSelected, onSelect }: BlockComponentProps<ColumnsData>) {
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)
  const data = block.data
  const variant = data.variant || "plain"
  const rightImage = data.rightImage || ""

  useEffect(() => {
    if (leftRef.current && leftRef.current.innerHTML !== data.left) leftRef.current.innerHTML = data.left
    if (rightRef.current && rightRef.current.innerHTML !== data.right) rightRef.current.innerHTML = data.right
  }, [])

  return (
    <div onClick={onSelect}>
      <div className={`nl-columns-block ${variant === "card" ? "nl-columns-card" : ""}`}>
        <div
          ref={leftRef}
          contentEditable
          suppressContentEditableWarning
          className="nl-column-cell"
          data-placeholder="Left column"
          onInput={() => leftRef.current && onUpdate({ left: leftRef.current.innerHTML })}
        />
        {rightImage ? (
          <div className="nl-column-media">
            <img src={rightImage} alt="" />
          </div>
        ) : (
          <div
            ref={rightRef}
            contentEditable
            suppressContentEditableWarning
            className="nl-column-cell"
            data-placeholder="Right column"
            onInput={() => rightRef.current && onUpdate({ right: rightRef.current.innerHTML })}
          />
        )}
      </div>
      <BlockSettings active={isSelected}>
        <div className="nl-block-settings">
          <div className="nl-block-settings-row">
            <span className="nl-settings-label">Frame</span>
            <div className="nl-pill-group">
              {(["plain", "card"] as const).map((next) => (
                <button
                  key={next}
                  type="button"
                  className={`nl-pill ${variant === next ? "nl-pill-active" : ""}`}
                  onClick={() => onUpdate({ variant: next })}
                >
                  {next === "plain" ? "Plain" : "Card"}
                </button>
              ))}
            </div>
          </div>
          <div className="nl-block-settings-row">
            <span className="nl-settings-label">Image</span>
            <input
              className="nl-settings-input"
              value={rightImage}
              placeholder="Optional image URL for the right column"
              onChange={(e) => onUpdate({ rightImage: e.target.value })}
            />
          </div>
        </div>
      </BlockSettings>
    </div>
  )
}
