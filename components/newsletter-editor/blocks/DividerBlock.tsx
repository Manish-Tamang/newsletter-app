"use client"

import type { BlockComponentProps, DividerData } from "../core/types"

export function DividerBlock({ block }: BlockComponentProps<DividerData>) {
  return (
    <div className="nl-divider-block">
      <hr style={{ margin: 0, border: "none", borderTop: `1px ${block.data.style} ${block.data.color}` }} />
    </div>
  )
}
