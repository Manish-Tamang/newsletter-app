"use client"

import { useEffect, useRef } from "react"
import type { BlockComponentProps, TextData } from "../types"
import { BlockSettings } from "../BlockSettings"
import { AlignPills, ColorField } from "../settings-controls"

export function TextBlock({ block, onUpdate, isSelected, onSelect }: BlockComponentProps<TextData>) {
  const ref = useRef<HTMLDivElement>(null)
  const data = block.data
  const size = data.size || "body"

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
        className={`nl-text-block nl-text-${size}`}
        style={{ textAlign: data.alignment, color: data.color || undefined }}
        data-placeholder="Write the paragraph"
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
            <span className="nl-settings-label">Size</span>
            <div className="nl-pill-group">
              {(["small", "body", "large"] as const).map((next) => (
                <button
                  key={next}
                  type="button"
                  className={`nl-pill ${size === next ? "nl-pill-active" : ""}`}
                  onClick={() => onUpdate({ size: next })}
                >
                  {next.charAt(0).toUpperCase() + next.slice(1)}
                </button>
              ))}
            </div>
            <AlignPills value={data.alignment} onChange={(alignment) => onUpdate({ alignment })} />
            <ColorField label="Color" value={data.color || "#3f3f46"} onChange={(color) => onUpdate({ color })} />
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
