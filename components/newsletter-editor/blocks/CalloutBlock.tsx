"use client"

import { useEffect, useRef } from "react"
import type { BlockComponentProps, CalloutData } from "../types"
import { BlockSettings } from "../BlockSettings"
import { AlignPills, ColorField } from "../settings-controls"

export function CalloutBlock({ block, onUpdate, isSelected, onSelect }: BlockComponentProps<CalloutData>) {
  const ref = useRef<HTMLDivElement>(null)
  const data = block.data

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== data.content) {
      ref.current.innerHTML = data.content
    }
  }, [])

  return (
    <div onClick={onSelect}>
      <div className="nl-callout-wrap">
        <div
          ref={ref}
          contentEditable
          suppressContentEditableWarning
          className={`nl-callout ${data.mono ? "nl-callout-mono" : ""}`}
          style={{
            backgroundColor: data.backgroundColor,
            color: data.textColor,
            textAlign: data.alignment,
            borderRadius: data.radius,
          }}
          data-placeholder="Highlighted note or code"
          onInput={() => ref.current && onUpdate({ content: ref.current.innerHTML })}
        />
      </div>
      <BlockSettings active={isSelected}>
        <div className="nl-block-settings">
          <div className="nl-block-settings-row">
            <ColorField label="Fill" value={data.backgroundColor} onChange={(backgroundColor) => onUpdate({ backgroundColor })} />
            <ColorField label="Text" value={data.textColor} onChange={(textColor) => onUpdate({ textColor })} />
            <AlignPills value={data.alignment} onChange={(alignment) => onUpdate({ alignment })} />
            <button
              type="button"
              className={`nl-pill ${data.mono ? "nl-pill-active" : ""}`}
              onClick={() => onUpdate({ mono: !data.mono })}
            >
              Mono
            </button>
          </div>
        </div>
      </BlockSettings>
    </div>
  )
}
