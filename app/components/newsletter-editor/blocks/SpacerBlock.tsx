"use client"

import type { BlockComponentProps, SpacerData } from "../core/types"

export function SpacerBlock({ block, isSelected }: BlockComponentProps<SpacerData>) {
  return (
    <div
      className={`nl-spacer-block ${isSelected ? "nl-is-selected" : ""}`}
      style={{ height: block.data.height }}
      data-height={`${block.data.height}px`}
    />
  )
}
