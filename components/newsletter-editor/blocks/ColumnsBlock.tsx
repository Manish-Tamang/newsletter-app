"use client"

import { useRef, useEffect } from "react"
import type { BlockComponentProps, ColumnsData } from "../types"

export function ColumnsBlock({ block, onUpdate, onSelect }: BlockComponentProps<ColumnsData>) {
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (leftRef.current && leftRef.current.innerHTML !== block.data.left) {
      leftRef.current.innerHTML = block.data.left
    }
    if (rightRef.current && rightRef.current.innerHTML !== block.data.right) {
      rightRef.current.innerHTML = block.data.right
    }
  }, [])

  return (
    <div onClick={onSelect}>
      <div className="nl-columns-block">
        <div>
          <div
            ref={leftRef}
            contentEditable
            suppressContentEditableWarning
            className="nl-column-cell"
            data-placeholder="Left column..."
            onInput={() => {
              if (leftRef.current) onUpdate({ left: leftRef.current.innerHTML })
            }}
          />
        </div>
        <div>
          <div
            ref={rightRef}
            contentEditable
            suppressContentEditableWarning
            className="nl-column-cell"
            data-placeholder="Right column..."
            onInput={() => {
              if (rightRef.current) onUpdate({ right: rightRef.current.innerHTML })
            }}
          />
        </div>
      </div>
    </div>
  )
}
