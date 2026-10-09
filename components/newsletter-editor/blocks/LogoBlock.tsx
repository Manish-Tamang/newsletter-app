"use client"

import { useEffect, useRef } from "react"
import type { BlockComponentProps, LogoData } from "../types"
import { BlockSettings } from "../BlockSettings"
import { AlignPills, ColorField } from "../settings-controls"

export function LogoBlock({ block, onUpdate, isSelected, onSelect }: BlockComponentProps<LogoData>) {
  const wordRef = useRef<HTMLSpanElement>(null)
  const suffixRef = useRef<HTMLSpanElement>(null)
  const data = block.data

  useEffect(() => {
    if (wordRef.current && wordRef.current.innerText !== data.wordmark) {
      wordRef.current.innerText = data.wordmark
    }
    if (suffixRef.current && suffixRef.current.innerText !== data.suffix) {
      suffixRef.current.innerText = data.suffix
    }
  }, [data.wordmark, data.suffix])

  return (
    <div onClick={onSelect}>
      <div className={`nl-logo-block nl-align-${data.alignment}`}>
        <div className="nl-logo-lockup">
          {data.src ? (
            <img src={data.src} alt={data.alt || data.wordmark} style={{ width: data.width, height: "auto" }} />
          ) : null}
          <span
            ref={wordRef}
            contentEditable
            suppressContentEditableWarning
            className="nl-logo-wordmark"
            data-placeholder="Brand"
            onBlur={() => wordRef.current && onUpdate({ wordmark: wordRef.current.innerText })}
          />
          <span
            ref={suffixRef}
            contentEditable
            suppressContentEditableWarning
            className="nl-logo-suffix"
            data-placeholder="suffix"
            style={{ display: data.suffix || isSelected ? undefined : "none" }}
            onBlur={() => suffixRef.current && onUpdate({ suffix: suffixRef.current.innerText.trim() })}
          />
        </div>
        {data.showRule ? <div className="nl-logo-rule" style={{ backgroundColor: data.ruleColor }} /> : null}
      </div>
      <BlockSettings active={isSelected}>
        <div className="nl-block-settings">
          <div className="nl-block-settings-row">
            <span className="nl-settings-label">Logo URL</span>
            <input
              className="nl-settings-input"
              value={data.src}
              placeholder="https://…"
              onChange={(e) => onUpdate({ src: e.target.value })}
            />
          </div>
          <div className="nl-block-settings-row">
            <AlignPills value={data.alignment} onChange={(alignment) => onUpdate({ alignment })} />
            <span className="nl-settings-label">Width</span>
            <input
              type="range"
              min={16}
              max={160}
              value={data.width}
              onChange={(e) => onUpdate({ width: Number(e.target.value) })}
            />
            <button
              type="button"
              className={`nl-pill ${data.showRule ? "nl-pill-active" : ""}`}
              onClick={() => onUpdate({ showRule: !data.showRule })}
            >
              Underline
            </button>
            {data.showRule ? <ColorField label="Rule" value={data.ruleColor} onChange={(ruleColor) => onUpdate({ ruleColor })} /> : null}
          </div>
        </div>
      </BlockSettings>
    </div>
  )
}
