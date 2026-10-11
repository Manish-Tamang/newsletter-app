"use client"

import type { ReactNode } from "react"

export function ToolbarGroup({
  label,
  children,
}: {
  label?: string
  children: ReactNode
}) {
  return (
    <div className="nl-toolbar-group">
      {label ? <span className="nl-toolbar-group-label">{label}</span> : null}
      <div className="nl-toolbar-group-btns">{children}</div>
    </div>
  )
}

export function ToolbarButton({
  title,
  active,
  disabled,
  danger,
  onClick,
  children,
}: {
  title: string
  active?: boolean
  disabled?: boolean
  danger?: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      aria-pressed={active}
      className={`nl-toolbar-btn ${active ? "nl-active" : ""} ${danger ? "nl-danger" : ""}`}
      disabled={disabled}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export function ToolbarSeparator() {
  return <div className="nl-toolbar-separator" role="separator" />
}
