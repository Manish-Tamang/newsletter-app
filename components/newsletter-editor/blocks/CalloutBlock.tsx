"use client"

import type { BlockComponentProps, CalloutData } from "../core/types"
import { useEditable } from "./useEditable"

export function CalloutBlock({ block, onUpdate }: BlockComponentProps<CalloutData>) {
  const data = block.data
  const editable = useEditable({
    value: data.content,
    onChange: (content) => onUpdate({ content }, { typing: true }),
  })

  return (
    <div className="nl-callout-wrap">
      <div
        ref={editable.ref}
        {...editable.props}
        className={`nl-callout ${data.mono ? "nl-callout-mono" : ""}`}
        style={{
          backgroundColor: data.backgroundColor,
          color: data.textColor,
          textAlign: data.alignment,
          borderRadius: data.radius,
        }}
        data-placeholder="Highlighted note or code"
      />
    </div>
  )
}
