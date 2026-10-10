"use client"

import { useState, type FormEvent } from "react"
import { ImageIcon, Link2 } from "lucide-react"
import type { BlockComponentProps, ImageData } from "../core/types"

const WIDTHS: Record<ImageData["width"], string> = { full: "100%", medium: "72%", small: "42%" }

export function ImageBlock({ block, onUpdate, isSelected }: BlockComponentProps<ImageData>) {
  const data = block.data
  const [draft, setDraft] = useState("")
  const [failed, setFailed] = useState(false)

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const src = draft.trim()
    if (!src) return
    setFailed(false)
    onUpdate({ src })
    setDraft("")
  }

  if (!data.src) {
    return (
      <div className={`nl-image-placeholder ${isSelected ? "nl-is-selected" : ""}`}>
        <div className="nl-image-placeholder-icon">
          <ImageIcon size={18} />
        </div>
        <div className="nl-image-placeholder-copy">
          <strong>Add an image</strong>
          <span>Paste a hosted image URL. Inline uploads are not supported by email clients.</span>
        </div>
        <form className="nl-image-placeholder-form" onSubmit={submit} onMouseDown={(event) => event.stopPropagation()}>
          <Link2 size={14} />
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="https://example.com/image.jpg"
            aria-label="Image URL"
          />
          <button type="submit" disabled={!draft.trim()}>
            Add
          </button>
        </form>
      </div>
    )
  }

  const justify = data.alignment === "center" ? "center" : data.alignment === "right" ? "flex-end" : "flex-start"

  return (
    <div className="nl-image-block" style={{ display: "flex", justifyContent: justify }}>
      {failed ? (
        <div className="nl-image-broken" style={{ width: WIDTHS[data.width] }}>
          <ImageIcon size={16} />
          <span>Image could not be loaded</span>
        </div>
      ) : (
        <img
          src={data.src}
          alt={data.alt}
          style={{ width: WIDTHS[data.width] || "100%", borderRadius: data.radius ?? 0 }}
          onError={() => setFailed(true)}
          onLoad={() => setFailed(false)}
          draggable={false}
        />
      )}
    </div>
  )
}
