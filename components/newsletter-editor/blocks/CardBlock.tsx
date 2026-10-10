"use client"

import type { CSSProperties } from "react"
import type { BlockComponentProps, CardData } from "../core/types"
import { useEditable } from "./useEditable"

export function CardBlock({ block, onUpdate, isSelected }: BlockComponentProps<CardData>) {
  const data = block.data

  const title = useEditable<HTMLParagraphElement>({
    value: data.title,
    mode: "singleline",
    onChange: (value) => onUpdate({ title: value }, { typing: true }),
  })
  const body = useEditable({ value: data.body, onChange: (value) => onUpdate({ body: value }, { typing: true }) })
  const buttonLabel = useEditable<HTMLSpanElement>({
    value: data.buttonLabel,
    mode: "singleline",
    onChange: (value) => onUpdate({ buttonLabel: value }, { typing: true }),
  })

  const buttonStyle: CSSProperties = {
    display: "inline-block",
    marginTop: 12,
    padding: "8px 14px",
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 600,
    lineHeight: 1.2,
    backgroundColor: data.buttonVariant === "filled" ? data.buttonColor : "transparent",
    color: data.buttonVariant === "filled" ? "#ffffff" : data.buttonColor,
    border: data.buttonVariant === "outline" ? `1px solid ${data.buttonColor}` : "1px solid transparent",
  }

  return (
    <div className="nl-card-wrap">
      <div className="nl-split-card">
        <div className="nl-split-copy">
          <p ref={title.ref} {...title.props} className="nl-split-title" data-placeholder="Card title" />
          <div ref={body.ref} {...body.props} className="nl-split-body" data-placeholder="One or two lines of context" />
          <span
            ref={buttonLabel.ref}
            {...buttonLabel.props}
            className="nl-button"
            style={{ ...buttonStyle, display: data.buttonLabel || isSelected ? "inline-block" : "none" }}
            data-placeholder="Button"
          />
        </div>
        <div className="nl-split-media">
          {data.imageUrl ? <img src={data.imageUrl} alt={data.imageAlt || ""} draggable={false} /> : <div className="nl-split-fallback" />}
        </div>
      </div>
    </div>
  )
}
