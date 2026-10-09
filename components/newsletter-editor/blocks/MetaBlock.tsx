"use client"

import { useEffect, useRef } from "react"
import type { BlockComponentProps, MetaData } from "../types"
import { BlockSettings } from "../BlockSettings"
import { AlignPills } from "../settings-controls"

export function MetaBlock({ block, onUpdate, isSelected, onSelect }: BlockComponentProps<MetaData>) {
  const labelRef = useRef<HTMLSpanElement>(null)
  const valueRef = useRef<HTMLSpanElement>(null)
  const data = block.data

  useEffect(() => {
    if (labelRef.current && labelRef.current.innerText !== data.label) labelRef.current.innerText = data.label
    if (valueRef.current && valueRef.current.innerText !== data.value) valueRef.current.innerText = data.value
  }, [])

  return (
    <div onClick={onSelect}>
      <p className="nl-meta" style={{ textAlign: data.alignment }}>
        <span
          ref={labelRef}
          contentEditable
          suppressContentEditableWarning
          onBlur={() => labelRef.current && onUpdate({ label: labelRef.current.innerText })}
        />
        {data.label ? ": " : null}
        <span
          ref={valueRef}
          contentEditable
          suppressContentEditableWarning
          className="nl-meta-value"
          onBlur={() => valueRef.current && onUpdate({ value: valueRef.current.innerText })}
        />
      </p>
      <BlockSettings active={isSelected}>
        <div className="nl-block-settings">
          <div className="nl-block-settings-row">
            <span className="nl-settings-label">Link</span>
            <input
              className="nl-settings-input"
              value={data.valueUrl}
              placeholder="Optional URL for the value"
              onChange={(e) => onUpdate({ valueUrl: e.target.value })}
            />
            <AlignPills value={data.alignment} onChange={(alignment) => onUpdate({ alignment })} />
          </div>
        </div>
      </BlockSettings>
    </div>
  )
}
