"use client"

import type { BlockComponentProps, HeadingData } from "../core/types"
import { useEditable } from "./useEditable"

export function HeadingBlock({ block, onUpdate }: BlockComponentProps<HeadingData>) {
  const data = block.data
  const editable = useEditable({
    value: data.content,
    onChange: (content) => onUpdate({ content }, { typing: true }),
  })

  return (
    <div
      ref={editable.ref}
      {...editable.props}
      className={`nl-heading nl-heading-${data.level}`}
      style={{ textAlign: data.alignment, color: data.color || undefined }}
      data-placeholder="Type a heading"
    />
  )
}
