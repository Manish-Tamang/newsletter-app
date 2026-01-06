"use client"

import { useRef, useEffect } from "react"
import type { BlockComponentProps, TextData } from "../types"

export function TextBlock({ block, onUpdate, isSelected, onSelect }: BlockComponentProps<TextData>) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== block.data.content) {
      ref.current.innerHTML = block.data.content
    }
  }, [])

  return (
    <div onClick={onSelect}>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        className="nl-text-block"
        style={{ textAlign: block.data.alignment }}
        data-placeholder="Start writing your content..."
        onPaste={(e) => {
          e.preventDefault()
          const text = e.clipboardData.getData("text/plain")
          document.execCommand("insertText", false, text)
        }}
        onInput={() => {
          if (ref.current) {
            onUpdate({ content: ref.current.innerHTML })
          }
        }}
      />
      {isSelected && (
        <div className="nl-block-settings">
          <div className="nl-block-settings-row">
            <span className="nl-settings-label">Align</span>
            <div className="nl-pill-group">
              {(["left", "center", "right"] as const).map((alignment) => (
                <button
                  key={alignment}
                  className={`nl-pill ${block.data.alignment === alignment ? "nl-pill-active" : ""}`}
                  onClick={() => onUpdate({ alignment })}
                >
                  {alignment.charAt(0).toUpperCase() + alignment.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
