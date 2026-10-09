"use client"

import { useState } from "react"
import { ImageIcon } from "lucide-react"
import type { BlockComponentProps, ImageData } from "../types"
import { BlockSettings } from "../BlockSettings"
import { AlignPills } from "../settings-controls"

export function ImageBlock({ block, onUpdate, isSelected, onSelect }: BlockComponentProps<ImageData>) {
  const [inputUrl, setInputUrl] = useState(block.data.src)
  const data = block.data
  const radius = data.radius ?? 0

  const applyUrl = () => onUpdate({ src: inputUrl.trim() })

  return (
    <div onClick={onSelect}>
      {data.src ? (
        <div className="nl-image-block" style={{ textAlign: data.alignment }}>
          <img
            src={data.src}
            alt={data.alt}
            style={{
              width: data.width === "full" ? "100%" : data.width === "medium" ? "72%" : "42%",
              display: data.alignment === "center" ? "block" : "inline-block",
              margin: data.alignment === "center" ? "0 auto" : undefined,
              borderRadius: radius,
            }}
          />
        </div>
      ) : (
        <div className="nl-image-placeholder">
          <ImageIcon size={18} />
          <span>Add an image URL</span>
        </div>
      )}
      <BlockSettings active={isSelected}>
        <div className="nl-block-settings">
          <div className="nl-block-settings-row">
            <span className="nl-settings-label">URL</span>
            <input
              className="nl-settings-input"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              onBlur={applyUrl}
              onKeyDown={(e) => e.key === "Enter" && applyUrl()}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div className="nl-block-settings-row">
            <span className="nl-settings-label">Alt</span>
            <input
              className="nl-settings-input"
              value={data.alt}
              onChange={(e) => onUpdate({ alt: e.target.value })}
              placeholder="Description"
            />
          </div>
          <div className="nl-block-settings-row">
            <span className="nl-settings-label">Size</span>
            <div className="nl-pill-group">
              {(["small", "medium", "full"] as const).map((width) => (
                <button
                  key={width}
                  type="button"
                  className={`nl-pill ${data.width === width ? "nl-pill-active" : ""}`}
                  onClick={() => onUpdate({ width })}
                >
                  {width.charAt(0).toUpperCase() + width.slice(1)}
                </button>
              ))}
            </div>
            <span className="nl-settings-label">Radius</span>
            <div className="nl-pill-group">
              {([0, 8, 12] as const).map((next) => (
                <button
                  key={next}
                  type="button"
                  className={`nl-pill ${radius === next ? "nl-pill-active" : ""}`}
                  onClick={() => onUpdate({ radius: next })}
                >
                  {next === 0 ? "Square" : next}
                </button>
              ))}
            </div>
            <AlignPills value={data.alignment} onChange={(alignment) => onUpdate({ alignment })} />
          </div>
          <div className="nl-block-settings-row">
            <span className="nl-settings-label">Link</span>
            <input
              className="nl-settings-input"
              value={data.linkUrl}
              onChange={(e) => onUpdate({ linkUrl: e.target.value })}
              placeholder="Optional click-through URL"
            />
          </div>
        </div>
      </BlockSettings>
    </div>
  )
}
