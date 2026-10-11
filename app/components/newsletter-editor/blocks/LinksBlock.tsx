"use client"

import type { BlockComponentProps, LinksData } from "../core/types"

export function LinksBlock({ block }: BlockComponentProps<LinksData>) {
  const data = block.data
  const items = data.items.filter((item) => item.label)

  return (
    <p className="nl-links" style={{ textAlign: data.alignment }}>
      {items.length === 0 ? (
        <span className="nl-links-empty">Add links in the settings panel</span>
      ) : (
        items.map((item, index) => (
          <span key={item.id}>
            {index > 0 ? <span className="nl-links-sep">|</span> : null}
            <span className="nl-links-item">{item.label}</span>
          </span>
        ))
      )}
    </p>
  )
}
