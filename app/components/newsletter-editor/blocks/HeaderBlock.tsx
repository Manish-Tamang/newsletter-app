"use client"

import { Calendar } from "lucide-react"
import type { BlockComponentProps, HeaderData } from "../core/types"
import { useEditable } from "./useEditable"

export function HeaderBlock({ block, onUpdate, isSelected }: BlockComponentProps<HeaderData>) {
  const data = block.data
  const alignment = data.alignment || "center"
  const textColor = data.textColor || "#18181b"

  const title = useEditable<HTMLHeadingElement>({
    value: data.title,
    mode: "singleline",
    onChange: (value) => onUpdate({ title: value }, { typing: true }),
  })
  const subtitle = useEditable<HTMLParagraphElement>({
    value: data.subtitle,
    mode: "singleline",
    onChange: (value) => onUpdate({ subtitle: value }, { typing: true }),
  })

  const dateString = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
  const justify = alignment === "right" ? "flex-end" : alignment === "left" ? "flex-start" : "center"

  return (
    <div className="nl-header-block" style={{ backgroundColor: data.backgroundColor || "#ffffff", color: textColor, textAlign: alignment }}>
      {data.logoUrl ? (
        <img
          src={data.logoUrl}
          alt="Logo"
          className="nl-header-logo"
          style={{ width: data.logoWidth || 80 }}
          draggable={false}
        />
      ) : null}
      <h1 ref={title.ref} {...title.props} className="nl-header-title" style={{ color: textColor }} data-placeholder="Newsletter title" />
      <p
        ref={subtitle.ref}
        {...subtitle.props}
        className="nl-header-subtitle"
        style={{ color: textColor, display: data.subtitle || isSelected ? undefined : "none" }}
        data-placeholder="Short description"
      />
      {data.showDate ? (
        <div className="nl-header-date" style={{ justifyContent: justify }}>
          <Calendar size={12} />
          <span>{dateString}</span>
        </div>
      ) : null}
    </div>
  )
}
