"use client"

import type { KeyboardEvent } from "react"
import type { BlockComponentProps, ListData, ListItem } from "../core/types"
import { generateBlockId } from "../core/types"
import { useEditable } from "./useEditable"

function ListItemEditor({
  item,
  onChange,
  onEnter,
  onRemoveEmpty,
}: {
  item: ListItem
  onChange: (content: string) => void
  onEnter: () => void
  onRemoveEmpty: () => void
}) {
  const editable = useEditable({ value: item.content, onChange })

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    editable.props.onKeyDown(event)
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      onEnter()
    }
    if (event.key === "Backspace" && (event.currentTarget.textContent ?? "") === "") {
      event.preventDefault()
      onRemoveEmpty()
    }
  }

  return <div ref={editable.ref} {...editable.props} onKeyDown={onKeyDown} className="nl-list-item-text" data-placeholder="List item" />
}

export function ListBlock({ block, onUpdate }: BlockComponentProps<ListData>) {
  const data = block.data
  const Tag = data.style === "number" ? "ol" : "ul"

  const updateItem = (id: string, content: string) => {
    onUpdate({ items: data.items.map((item) => (item.id === id ? { ...item, content } : item)) }, { typing: true })
  }

  const insertAfter = (id: string) => {
    const index = data.items.findIndex((item) => item.id === id)
    const next: ListItem = { id: generateBlockId(), content: "" }
    const items = [...data.items.slice(0, index + 1), next, ...data.items.slice(index + 1)]
    onUpdate({ items })
    requestAnimationFrame(() => {
      const el = document.querySelector<HTMLElement>(`[data-list-item="${next.id}"] [contenteditable]`)
      el?.focus()
    })
  }

  const removeItem = (id: string) => {
    if (data.items.length <= 1) return
    const index = data.items.findIndex((item) => item.id === id)
    const items = data.items.filter((item) => item.id !== id)
    onUpdate({ items })
    const target = items[Math.max(0, index - 1)]
    requestAnimationFrame(() => {
      const el = document.querySelector<HTMLElement>(`[data-list-item="${target.id}"] [contenteditable]`)
      if (!el) return
      el.focus()
      const selection = window.getSelection()
      const range = document.createRange()
      range.selectNodeContents(el)
      range.collapse(false)
      selection?.removeAllRanges()
      selection?.addRange(range)
    })
  }

  return (
    <div className="nl-list-block" style={{ textAlign: data.alignment || "left" }}>
      <Tag style={{ ["--nl-marker" as string]: data.markerColor }}>
        {data.items.map((item) => (
          <li key={item.id} data-list-item={item.id}>
            <ListItemEditor
              item={item}
              onChange={(content) => updateItem(item.id, content)}
              onEnter={() => insertAfter(item.id)}
              onRemoveEmpty={() => removeItem(item.id)}
            />
          </li>
        ))}
      </Tag>
    </div>
  )
}
