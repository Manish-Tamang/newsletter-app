"use client"

import type { BlockComponentProps, ColumnsData } from "../core/types"
import { useEditable } from "./useEditable"

export function ColumnsBlock({ block, onUpdate }: BlockComponentProps<ColumnsData>) {
  const data = block.data
  const variant = data.variant || "plain"
  const rightImage = data.rightImage || ""

  const left = useEditable({ value: data.left, onChange: (value) => onUpdate({ left: value }, { typing: true }) })
  const right = useEditable({ value: data.right, onChange: (value) => onUpdate({ right: value }, { typing: true }) })

  return (
    <div className={`nl-columns-block ${variant === "card" ? "nl-columns-card" : ""}`}>
      <div ref={left.ref} {...left.props} className="nl-column-cell" data-placeholder="Left column" />
      {rightImage ? (
        <div className="nl-column-media">
          <img src={rightImage} alt="" draggable={false} />
        </div>
      ) : (
        <div ref={right.ref} {...right.props} className="nl-column-cell" data-placeholder="Right column" />
      )}
    </div>
  )
}
