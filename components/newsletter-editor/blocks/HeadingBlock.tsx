"use client"

import { useEffect, useRef } from "react"
import type { BlockComponentProps, HeadingData } from "../types"
import { BlockSettings } from "../BlockSettings"
import { AlignPills, ColorField } from "../settings-controls"

export function HeadingBlock({ block, onUpdate, isSelected, onSelect }: BlockComponentProps<HeadingData>) {
  const ref = useRef<HTMLDivElement>(null)
  const data = block.data

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== data.content) {
      ref.current.innerHTML = data.content
    }
  }, [])

  return (
    <div onClick={onSelect}>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        className={`nl-heading-${data.level}`}
        style={{ textAlign: data.alignment, color: data.color || undefined }}
        data-placeholder="Type a heading"
        onPaste={(e) => {
          e.preventDefault()
          const text = e.clipboardData.getData("text/plain")
          document.execCommand("insertText", false, text)
        }}
        onInput={() => {
          if (ref.current) onUpdate({ content: ref.current.innerHTML })
        }}
      />
      <BlockSettings active={isSelected}>
        <div className="nl-block-settings">
          <div className="nl-block-settings-row">
            <span className="nl-settings-label">Level</span>
            <div className="nl-pill-group">
              {([1, 2, 3] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  className={`nl-pill ${data.level === level ? "nl-pill-active" : ""}`}
                  onClick={() => onUpdate({ level })}
                >
                  H{level}
                </button>
              ))}
            </div>
            <AlignPills value={data.alignment} onChange={(alignment) => onUpdate({ alignment })} />
            <ColorField
              label="Color"
              value={data.color || "#111827"}
              onChange={(color) => onUpdate({ color })}
            />
            {data.color ? (
              <button type="button" className="nl-pill" onClick={() => onUpdate({ color: "" })}>
                Default
              </button>
            ) : null}
          </div>
        </div>
      </BlockSettings>
    </div>
  )
}
