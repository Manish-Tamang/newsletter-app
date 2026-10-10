"use client"

import type { BlockComponentProps, TextData } from "../core/types"
import { useEditable } from "./useEditable"

export function TextBlock({ block, onUpdate }: BlockComponentProps<TextData>) {
  const data = block.data
  const size = data.size || "body"
  const editable = useEditable({
    value: data.content,
    onChange: (content) => onUpdate({ content }, { typing: true }),
  })

  return (
    <div
      ref={editable.ref}
      {...editable.props}
      className={`nl-text-block nl-text-${size}`}
      style={{ textAlign: data.alignment, color: data.color || undefined }}
      data-placeholder="Write a paragraph. Select text to format it."
    />
  )
}
