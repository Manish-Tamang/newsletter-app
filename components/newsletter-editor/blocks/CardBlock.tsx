"use client"

import { useEffect, useRef } from "react"
import type { BlockComponentProps, CardData } from "../types"
import { BlockSettings } from "../BlockSettings"
import { ColorField } from "../settings-controls"

export function CardBlock({ block, onUpdate, isSelected, onSelect }: BlockComponentProps<CardData>) {
  const titleRef = useRef<HTMLParagraphElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const data = block.data

  useEffect(() => {
    if (titleRef.current && titleRef.current.innerText !== data.title) titleRef.current.innerText = data.title
    if (bodyRef.current && bodyRef.current.innerHTML !== data.body) bodyRef.current.innerHTML = data.body
  }, [])

  const buttonStyle: React.CSSProperties = {
    display: "inline-block",
    marginTop: 12,
    padding: "8px 14px",
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 600,
    lineHeight: 1.2,
    backgroundColor: data.buttonVariant === "filled" ? data.buttonColor : "transparent",
    color: data.buttonVariant === "filled" ? "#ffffff" : data.buttonColor,
    border: data.buttonVariant === "outline" ? `1px solid ${data.buttonColor}` : "none",
  }

  return (
    <div onClick={onSelect}>
      <div className="nl-card-wrap">
        <div className="nl-split-card">
          <div className="nl-split-copy">
            <p
              ref={titleRef}
              contentEditable
              suppressContentEditableWarning
              className="nl-split-title"
              onBlur={() => titleRef.current && onUpdate({ title: titleRef.current.innerText })}
            />
            <div
              ref={bodyRef}
              contentEditable
              suppressContentEditableWarning
              className="nl-split-body"
              onInput={() => bodyRef.current && onUpdate({ body: bodyRef.current.innerHTML })}
            />
            {data.buttonLabel ? (
              <span
                style={buttonStyle}
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => onUpdate({ buttonLabel: e.currentTarget.innerText })}
              >
                {data.buttonLabel}
              </span>
            ) : null}
          </div>
          <div className="nl-split-media">
            {data.imageUrl ? (
              <img src={data.imageUrl} alt={data.imageAlt || ""} />
            ) : (
              <div className="nl-split-fallback" />
            )}
          </div>
        </div>
      </div>
      <BlockSettings active={isSelected}>
        <div className="nl-block-settings">
          <div className="nl-block-settings-row">
            <span className="nl-settings-label">Button</span>
            <div className="nl-pill-group">
              {(["filled", "outline"] as const).map((buttonVariant) => (
                <button
                  key={buttonVariant}
                  type="button"
                  className={`nl-pill ${data.buttonVariant === buttonVariant ? "nl-pill-active" : ""}`}
                  onClick={() => onUpdate({ buttonVariant })}
                >
                  {buttonVariant === "filled" ? "Filled" : "Outline"}
                </button>
              ))}
            </div>
            <ColorField label="Color" value={data.buttonColor} onChange={(buttonColor) => onUpdate({ buttonColor })} />
          </div>
          <div className="nl-block-settings-row">
            <span className="nl-settings-label">URL</span>
            <input
              className="nl-settings-input"
              value={data.buttonUrl}
              placeholder="https://…"
              onChange={(e) => onUpdate({ buttonUrl: e.target.value })}
            />
          </div>
          <div className="nl-block-settings-row">
            <span className="nl-settings-label">Image</span>
            <input
              className="nl-settings-input"
              value={data.imageUrl}
              placeholder="https://… image on the right"
              onChange={(e) => onUpdate({ imageUrl: e.target.value })}
            />
          </div>
        </div>
      </BlockSettings>
    </div>
  )
}
