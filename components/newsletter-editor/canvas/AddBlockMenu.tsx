"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { Plus } from "lucide-react"
import { BLOCK_CATEGORIES, BLOCK_META, BLOCK_ORDER, type BlockType } from "../core/types"
import { BLOCK_ICONS } from "../blocks/icons"

export function AddBlockMenu({
  onAdd,
  alwaysVisible = false,
}: {
  onAdd: (type: BlockType) => void
  alwaysVisible?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onPointer = (event: MouseEvent) => {
      const target = event.target as Node
      if (buttonRef.current?.contains(target) || menuRef.current?.contains(target)) return
      setOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", onPointer)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onPointer)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  const toggle = () => {
    const rect = buttonRef.current?.getBoundingClientRect()
    if (rect) {
      const width = 360
      const left = Math.min(Math.max(12, rect.left + rect.width / 2 - width / 2), window.innerWidth - width - 12)
      const top = rect.bottom + 8
      setCoords({ top, left })
    }
    setOpen((value) => !value)
  }

  return (
    <div className={`nl-add-block-zone ${alwaysVisible ? "nl-visible" : ""}`}>
      <div className="nl-add-hit">
        <button
          ref={buttonRef}
          type="button"
          className="nl-add-btn"
          aria-label="Add block"
          onClick={toggle}
        >
          <Plus size={12} />
        </button>
      </div>
      {open
        ? createPortal(
            <div
              ref={menuRef}
              className="nl-add-menu nl-add-menu-fixed"
              style={{ top: coords.top, left: coords.left, width: 360 }}
            >
              {BLOCK_CATEGORIES.map((category) => {
                const items = BLOCK_ORDER.filter((type) => BLOCK_META[type].category === category.id)
                return (
                  <div key={category.id} className="nl-add-menu-group">
                    <p>{category.label}</p>
                    <div className="nl-add-menu-grid">
                      {items.map((type) => {
                        const Icon = BLOCK_ICONS[type]
                        return (
                          <button
                            key={type}
                            type="button"
                            className="nl-add-menu-item"
                            onClick={() => {
                              onAdd(type)
                              setOpen(false)
                            }}
                          >
                            <Icon size={16} />
                            {BLOCK_META[type].label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>,
            document.body
          )
        : null}
    </div>
  )
}
