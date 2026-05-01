"use client"

import { useRef, useEffect } from "react"
import type { BlockComponentProps, HeadingData } from "../types"

export function HeadingBlock({ block, onUpdate, isSelected, onSelect }: BlockComponentProps<HeadingData>) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== block.data.content) {
      ref.current.innerHTML = block.data.content
    }
  }, [])

  const className = `nl-heading-${block.data.level}`

  return (
    <div onClick={onSelect}>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        className={className}
        style={{ textAlign: block.data.alignment }}
        data-placeholder="Type your heading..."
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
            <span className="nl-settings-label">Level</span>
            <div className="nl-pill-group">
              {([1, 2, 3] as const).map((level) => (
                <button
                  key={level}
                  className={`nl-pill ${block.data.level === level ? "nl-pill-active" : ""}`}
                  onClick={() => onUpdate({ level })}
                >
                  H{level}
                </button>
              ))}
            </div>
            <div className="nl-toolbar-separator" />
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
