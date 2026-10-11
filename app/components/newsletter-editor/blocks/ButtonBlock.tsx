"use client"

import type { CSSProperties } from "react"
import type { BlockComponentProps, ButtonData } from "../core/types"
import { useEditable } from "./useEditable"

export function buttonRadius(radius: ButtonData["borderRadius"]): string {
  return radius === "full" ? "999px" : radius === "small" ? "6px" : "0px"
}

export function ButtonBlock({ block, onUpdate }: BlockComponentProps<ButtonData>) {
  const { label, variant, color, alignment, borderRadius } = block.data
  const editable = useEditable<HTMLSpanElement>({
    value: label,
    mode: "singleline",
    onChange: (next) => onUpdate({ label: next }, { typing: true }),
  })

  const style: CSSProperties = {
    display: "inline-block",
    padding: "10px 18px",
    backgroundColor: variant === "filled" ? color : "transparent",
    color: variant === "filled" ? "#ffffff" : color,
    border: variant === "outline" ? `1px solid ${color}` : "1px solid transparent",
    borderRadius: buttonRadius(borderRadius),
    fontSize: 14,
    fontWeight: 600,
    lineHeight: 1.2,
    letterSpacing: "-0.01em",
    minWidth: 24,
  }

  return (
    <div className="nl-button-preview" style={{ textAlign: alignment }}>
      <span ref={editable.ref} {...editable.props} className="nl-button" style={style} data-placeholder="Button" />
    </div>
  )
}
