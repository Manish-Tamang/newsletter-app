"use client"

import { useState, useRef, useEffect } from "react"
import { Plus, Heading, Type, ImageIcon, MousePointerClick, Minus, MoveVertical, Columns2, PanelTop, PanelBottom, Share2 } from "lucide-react"
import type { BlockType } from "./types"

const BLOCK_OPTIONS: { type: BlockType; label: string; icon: React.ReactNode }[] = [
  { type: "header", label: "Header", icon: <PanelTop size={20} /> },
  { type: "heading", label: "Heading", icon: <Heading size={20} /> },
  { type: "text", label: "Text", icon: <Type size={20} /> },
  { type: "image", label: "Image", icon: <ImageIcon size={20} /> },
  { type: "button", label: "Button", icon: <MousePointerClick size={20} /> },
  { type: "divider", label: "Divider", icon: <Minus size={20} /> },
  { type: "spacer", label: "Spacer", icon: <MoveVertical size={20} /> },
  { type: "columns", label: "Columns", icon: <Columns2 size={20} /> },
  { type: "socials", label: "Socials", icon: <Share2 size={20} /> },
  { type: "footer", label: "Footer", icon: <PanelBottom size={20} /> },
]

interface AddBlockMenuProps {
  onAdd: (type: BlockType) => void
  alwaysVisible?: boolean
}

export function AddBlockMenu({ onAdd, alwaysVisible }: AddBlockMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen])

  return (
    <div className={`nl-add-block-zone ${alwaysVisible ? "nl-visible" : ""}`} ref={menuRef}>
      <button className="nl-add-btn" onClick={() => setIsOpen(!isOpen)} title="Add block">
        <Plus size={14} />
      </button>
      {isOpen && (
        <div className="nl-add-menu">
          {BLOCK_OPTIONS.map((option) => (
            <button
              key={option.type}
              className="nl-add-menu-item"
              onClick={() => {
                onAdd(option.type)
                setIsOpen(false)
              }}
            >
              {option.icon}
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
