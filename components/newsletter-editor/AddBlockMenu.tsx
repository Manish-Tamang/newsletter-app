"use client"

import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import {
  Plus,
  Heading,
  Type,
  ImageIcon,
  MousePointerClick,
  Minus,
  MoveVertical,
  Columns2,
  PanelTop,
  PanelBottom,
  Share2,
  Hexagon,
  Square,
  List,
  AtSign,
  Link2,
  RectangleHorizontal,
  GalleryHorizontal,
} from "lucide-react"
import type { BlockType } from "./types"

const BLOCK_OPTIONS: { type: BlockType; label: string; icon: React.ReactNode }[] = [
  { type: "logo", label: "Logo", icon: <Hexagon size={18} /> },
  { type: "heading", label: "Heading", icon: <Heading size={18} /> },
  { type: "text", label: "Text", icon: <Type size={18} /> },
  { type: "button", label: "Button", icon: <MousePointerClick size={18} /> },
  { type: "banner", label: "Banner", icon: <RectangleHorizontal size={18} /> },
  { type: "image", label: "Image", icon: <ImageIcon size={18} /> },
  { type: "card", label: "Card", icon: <GalleryHorizontal size={18} /> },
  { type: "callout", label: "Callout", icon: <Square size={18} /> },
  { type: "list", label: "List", icon: <List size={18} /> },
  { type: "meta", label: "Meta", icon: <AtSign size={18} /> },
  { type: "columns", label: "Columns", icon: <Columns2 size={18} /> },
  { type: "divider", label: "Divider", icon: <Minus size={18} /> },
  { type: "spacer", label: "Spacer", icon: <MoveVertical size={18} /> },
  { type: "links", label: "Links", icon: <Link2 size={18} /> },
  { type: "socials", label: "Socials", icon: <Share2 size={18} /> },
  { type: "footer", label: "Footer", icon: <PanelBottom size={18} /> },
  { type: "header", label: "Masthead", icon: <PanelTop size={18} /> },
]

interface AddBlockMenuProps {
  onAdd: (type: BlockType) => void
  alwaysVisible?: boolean
}

export function AddBlockMenu({ onAdd, alwaysVisible }: AddBlockMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [box, setBox] = useState({ top: 0, left: 0, maxHeight: 360 })
  const menuRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const toggle = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      const width = 360
      const spaceBelow = window.innerHeight - rect.bottom - 12
      const spaceAbove = rect.top - 12
      const up = spaceBelow < 220 && spaceAbove > spaceBelow
      const maxHeight = Math.max(180, Math.min(360, up ? spaceAbove : spaceBelow))
      const top = up ? Math.max(8, rect.top - 8 - maxHeight) : Math.min(rect.bottom + 8, window.innerHeight - maxHeight - 8)
      const left = Math.min(
        Math.max(8, rect.left + rect.width / 2 - width / 2),
        window.innerWidth - width - 8
      )
      setBox({ top, left, maxHeight })
    }
    setIsOpen((open) => !open)
  }

  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      if (menuRef.current?.contains(target) || panelRef.current?.contains(target)) return
      setIsOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen])

  return (
    <div className={`nl-add-block-zone ${alwaysVisible ? "nl-visible" : ""}`} ref={menuRef}>
      <div className="nl-add-hit">
        <button type="button" ref={buttonRef} className="nl-add-btn" onClick={toggle} title="Add block">
          <Plus size={14} />
        </button>
        {isOpen &&
          createPortal(
            <div
              ref={panelRef}
              className="nl-add-menu nl-add-menu-fixed"
              style={{ top: box.top, left: box.left, maxHeight: box.maxHeight }}
            >
              {BLOCK_OPTIONS.map((option) => (
                <button
                  key={option.type}
                  type="button"
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
            </div>,
            document.body
          )}
      </div>
    </div>
  )
}
