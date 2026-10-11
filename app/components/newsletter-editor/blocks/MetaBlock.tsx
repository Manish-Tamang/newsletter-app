"use client"

import type { BlockComponentProps, MetaData } from "../core/types"
import { useEditable } from "./useEditable"

export function MetaBlock({ block, onUpdate }: BlockComponentProps<MetaData>) {
  const data = block.data
  const label = useEditable<HTMLSpanElement>({
    value: data.label,
    mode: "singleline",
    onChange: (value) => onUpdate({ label: value }, { typing: true }),
  })
  const value = useEditable<HTMLSpanElement>({
    value: data.value,
    mode: "singleline",
    onChange: (next) => onUpdate({ value: next }, { typing: true }),
  })

  return (
    <p className="nl-meta" style={{ textAlign: data.alignment }}>
      <span ref={label.ref} {...label.props} className="nl-meta-label" data-placeholder="Label" />
      <span className="nl-meta-colon">{data.label ? ": " : " "}</span>
      <span ref={value.ref} {...value.props} className="nl-meta-value" data-placeholder="Value" />
    </p>
  )
}
