"use client"

import { useState, useRef } from "react"
import { ImageIcon, Upload } from "lucide-react"
import type { BlockComponentProps, ImageData } from "../types"

export function ImageBlock({ block, onUpdate, isSelected, onSelect }: BlockComponentProps<ImageData>) {
  const [inputUrl, setInputUrl] = useState(block.data.src)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleApplyUrl = () => {
    onUpdate({ src: inputUrl })
  }

  const handleFile = (_file: File) => {
    // Image upload disabled for now to avoid embedding base64 in emails.
    // Will be reconnected to hosted upload logic later.
    // if (!file.type.startsWith("image/")) return
    // const reader = new FileReader()
    // reader.onload = (e) => {
    //   if (e.target?.result) {
    //     const base64Url = e.target.result as string
    //     onUpdate({ src: base64Url })
    //     setInputUrl(base64Url)
    //   }
    // }
    // reader.readAsDataURL(file)
    return
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  const triggerUpload = () => {
    fileInputRef.current?.click()
  }

  return (
    <div onClick={onSelect}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: "none" }}
      />
      {block.data.src ? (
        <div className="nl-image-block" style={{ textAlign: block.data.alignment }}>
          <img
            src={block.data.src}
            alt={block.data.alt}
            style={{
              width: block.data.width === "full" ? "100%" : block.data.width === "medium" ? "70%" : "40%",
              display: block.data.alignment === "center" ? "block" : "inline-block",
              margin: block.data.alignment === "center" ? "0 auto" : undefined,
            }}
          />
        </div>
      ) : (
        <div
          className={`nl-image-placeholder ${isDragging ? "nl-dragging" : ""}`}
          onClick={onSelect}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <ImageIcon size={28} />
          <span style={{ fontSize: "13px", fontWeight: 500 }}>Drag & drop image here, or</span>
          <button
            type="button"
            className="nl-upload-btn-placeholder"
            onClick={(e) => {
              e.stopPropagation()
              onSelect()
              triggerUpload()
            }}
          >
            <Upload size={12} style={{ marginRight: "4px" }} />
            Choose File
          </button>
          <span style={{ fontSize: "11px" }}>or enter a URL below</span>
        </div>
      )}
      {isSelected && (
        <div className="nl-block-settings">
          <div className="nl-block-settings-row">
            <span className="nl-settings-label">Upload</span>
            <button
              type="button"
              className="nl-pill"
              onClick={triggerUpload}
              style={{ display: "flex", alignItems: "center", gap: "4px" }}
            >
              <Upload size={12} />
              Choose File
            </button>
            <span style={{ fontSize: "11px", color: "#9ca3af" }}>Accepts png, jpg, gif</span>
          </div>
          <div className="nl-block-settings-row">
            <span className="nl-settings-label">URL</span>
            <input
              className="nl-settings-input"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              onBlur={handleApplyUrl}
              onKeyDown={(e) => e.key === "Enter" && handleApplyUrl()}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div className="nl-block-settings-row">
            <span className="nl-settings-label">Alt</span>
            <input
              className="nl-settings-input"
              value={block.data.alt}
              onChange={(e) => onUpdate({ alt: e.target.value })}
              placeholder="Image description"
            />
          </div>
          <div className="nl-block-settings-row">
            <span className="nl-settings-label">Size</span>
            <div className="nl-pill-group">
              {(["small", "medium", "full"] as const).map((w) => (
                <button
                  key={w}
                  className={`nl-pill ${block.data.width === w ? "nl-pill-active" : ""}`}
                  onClick={() => onUpdate({ width: w })}
                >
                  {w.charAt(0).toUpperCase() + w.slice(1)}
                </button>
              ))}
            </div>
            <div className="nl-toolbar-separator" />
            <span className="nl-settings-label">Align</span>
            <div className="nl-pill-group">
              {(["left", "center", "right"] as const).map((a) => (
                <button
                  key={a}
                  className={`nl-pill ${block.data.alignment === a ? "nl-pill-active" : ""}`}
                  onClick={() => onUpdate({ alignment: a })}
                >
                  {a.charAt(0).toUpperCase() + a.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="nl-block-settings-row">
            <span className="nl-settings-label">Link</span>
            <input
              className="nl-settings-input"
              value={block.data.linkUrl}
              onChange={(e) => onUpdate({ linkUrl: e.target.value })}
              placeholder="Optional click-through URL"
            />
          </div>
        </div>
      )}
    </div>
  )
}
