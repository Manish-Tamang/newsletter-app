"use client"

import { useState, useRef, useEffect } from "react"
import { ImageIcon, Upload, Calendar } from "lucide-react"
import type { BlockComponentProps, HeaderData } from "../types"

export function HeaderBlock({ block, onUpdate, isSelected, onSelect }: BlockComponentProps<HeaderData>) {
  const [isDraggingLogo, setIsDraggingLogo] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)

  // Sync state to ref content
  useEffect(() => {
    if (titleRef.current && titleRef.current.innerText !== block.data.title) {
      titleRef.current.innerText = block.data.title
    }
  }, [block.data.title])

  useEffect(() => {
    if (subtitleRef.current && subtitleRef.current.innerText !== block.data.subtitle) {
      subtitleRef.current.innerText = block.data.subtitle
    }
  }, [block.data.subtitle])

  const handleTitleBlur = () => {
    if (titleRef.current) {
      onUpdate({ title: titleRef.current.innerText })
    }
  }

  const handleSubtitleBlur = () => {
    if (subtitleRef.current) {
      onUpdate({ subtitle: subtitleRef.current.innerText })
    }
  }

  const handleLogoUpload = (file: File) => {
    if (!file.type.startsWith("image/")) return
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        onUpdate({ logoUrl: e.target.result as string })
      }
    }
    reader.readAsDataURL(file)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleLogoUpload(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDraggingLogo(true)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDraggingLogo(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleLogoUpload(file)
  }

  const dateString = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })

  return (
    <div onClick={onSelect}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: "none" }}
      />
      <div 
        className="nl-header-block"
        style={{ 
          backgroundColor: block.data.backgroundColor || "#ffffff", 
          color: block.data.textColor || "#18181b",
          padding: "32px 24px",
          textAlign: "center",
          borderBottom: "1px solid #e5e7eb"
        }}
      >
        {block.data.logoUrl ? (
          <div 
            className="nl-header-logo-container" 
            style={{ marginBottom: "16px", position: "relative", display: "inline-block" }}
            onDragOver={handleDragOver}
            onDragLeave={() => setIsDraggingLogo(false)}
            onDrop={handleDrop}
          >
            <img 
              src={block.data.logoUrl} 
              alt="Logo" 
              style={{ 
                maxWidth: "100%", 
                width: `${block.data.logoWidth || 80}px`, 
                height: "auto",
                display: "inline-block",
                border: isDraggingLogo ? "2px dashed #4f46e5" : "none",
                borderRadius: "4px"
              }} 
            />
          </div>
        ) : (
          isSelected && (
            <div 
              className={`nl-logo-placeholder ${isDraggingLogo ? "nl-dragging" : ""}`}
              onClick={(e) => {
                e.stopPropagation()
                fileInputRef.current?.click()
              }}
              onDragOver={handleDragOver}
              onDragLeave={() => setIsDraggingLogo(false)}
              onDrop={handleDrop}
              style={{
                display: "inline-flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
                padding: "16px 24px",
                border: "1px dashed #c7d2fe",
                borderRadius: "6px",
                cursor: "pointer",
                marginBottom: "16px",
                background: "#fafafa"
              }}
            >
              <Upload size={16} style={{ color: "#818cf8" }} />
              <span style={{ fontSize: "11px", fontWeight: 500, color: "#6b7280" }}>Upload Logo</span>
            </div>
          )
        )}

        <h1
          ref={titleRef}
          contentEditable
          suppressContentEditableWarning
          onBlur={handleTitleBlur}
          className="nl-header-title-edit"
          style={{
            margin: "0",
            fontSize: "24px",
            fontWeight: 800,
            lineHeight: "1.2",
            outline: "none",
            color: block.data.textColor || "#18181b",
          }}
          data-placeholder="NEWSLETTER TITLE"
        />

        <p
          ref={subtitleRef}
          contentEditable
          suppressContentEditableWarning
          onBlur={handleSubtitleBlur}
          className="nl-header-subtitle-edit"
          style={{
            margin: "6px 0 0 0",
            fontSize: "14px",
            outline: "none",
            color: block.data.textColor || "#18181b",
            opacity: 0.8
          }}
          data-placeholder="Enter newsletter description"
        />

        {block.data.showDate && (
          <div 
            style={{ 
              margin: "12px 0 0 0", 
              fontSize: "11px", 
              textTransform: "uppercase", 
              letterSpacing: "0.05em",
              opacity: 0.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px"
            }}
          >
            <Calendar size={12} />
            <span>{dateString}</span>
          </div>
        )}
      </div>

      {isSelected && (
        <div className="nl-block-settings">
          <div className="nl-block-settings-row">
            <span className="nl-settings-label">Logo</span>
            <button
              type="button"
              className="nl-pill"
              onClick={() => fileInputRef.current?.click()}
              style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
            >
              <Upload size={12} />
              {block.data.logoUrl ? "Change Logo" : "Upload Logo"}
            </button>
            {block.data.logoUrl && (
              <>
                <button
                  type="button"
                  className="nl-pill"
                  onClick={() => onUpdate({ logoUrl: "" })}
                  style={{ color: "#ef4444", borderColor: "#fecaca" }}
                >
                  Remove
                </button>
                <div className="nl-toolbar-separator" />
                <span className="nl-settings-label" style={{ minWidth: "auto" }}>Width</span>
                <input
                  type="range"
                  min="40"
                  max="240"
                  step="10"
                  value={block.data.logoWidth}
                  onChange={(e) => onUpdate({ logoWidth: parseInt(e.target.value) })}
                  style={{ cursor: "pointer", width: "100px" }}
                />
                <span style={{ fontSize: "11px" }}>{block.data.logoWidth}px</span>
              </>
            )}
          </div>
          
          <div className="nl-block-settings-row">
            <span className="nl-settings-label">Colors</span>
            <span style={{ fontSize: "12px", color: "#6b7280" }}>Background:</span>
            <input
              type="color"
              className="nl-color-swatch"
              value={block.data.backgroundColor || "#ffffff"}
              onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
            />
            <span style={{ fontSize: "12px", color: "#6b7280", marginLeft: "12px" }}>Text:</span>
            <input
              type="color"
              className="nl-color-swatch"
              value={block.data.textColor || "#18181b"}
              onChange={(e) => onUpdate({ textColor: e.target.value })}
            />
            
            <div className="nl-toolbar-separator" />
            
            <span className="nl-settings-label" style={{ minWidth: "auto" }}>Show Date</span>
            <button
              type="button"
              className={`nl-pill ${block.data.showDate ? "nl-pill-active" : ""}`}
              onClick={() => onUpdate({ showDate: !block.data.showDate })}
            >
              {block.data.showDate ? "Enabled" : "Disabled"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
