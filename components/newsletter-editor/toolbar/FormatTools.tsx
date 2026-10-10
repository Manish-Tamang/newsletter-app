"use client"

import { useEffect, useRef, useState } from "react"
import { Bold, Italic, Link2, Underline } from "lucide-react"
import { TEXT_LINK_COLOR } from "../core/theme"
import { ToolbarButton, ToolbarGroup } from "./ToolbarGroup"

const EDITABLE = ".nl-editor-wrapper [contenteditable='true'][data-rich='true']"

interface PendingLink {
  marker: HTMLSpanElement
  host: HTMLElement
  existing: HTMLAnchorElement | null
}

function editableOf(node: Node | null): HTMLElement | null {
  const el = node instanceof Element ? node : node?.parentElement
  return (el?.closest(EDITABLE) as HTMLElement | null) ?? null
}

function anchorOf(node: Node | null): HTMLAnchorElement | null {
  const el = node instanceof Element ? node : node?.parentElement
  return el?.closest("a") ?? null
}

function findAnchor(range: Range, host: HTMLElement): HTMLAnchorElement | null {
  const direct = anchorOf(range.startContainer) ?? anchorOf(range.endContainer)
  if (direct && host.contains(direct)) return direct
  if (range.collapsed) return null
  const text = range.toString().trim()
  for (const anchor of Array.from(host.querySelectorAll("a"))) {
    if (range.intersectsNode(anchor) && text && (anchor.textContent ?? "").includes(text)) return anchor
  }
  return null
}

function unwrap(el: HTMLElement) {
  const parent = el.parentNode
  if (!parent) return
  while (el.firstChild) parent.insertBefore(el.firstChild, el)
  parent.removeChild(el)
}

function emitInput(host: HTMLElement) {
  host.dispatchEvent(new Event("input", { bubbles: true }))
}

function normalizeHref(value: string): string {
  const href = value.trim()
  if (!href) return ""
  if (/^(https?:\/\/|mailto:|tel:)/i.test(href)) return href
  if (href.includes("@") && !href.includes("/")) return `mailto:${href}`
  return `https://${href}`
}

export function FormatTools() {
  const [state, setState] = useState({ bold: false, italic: false, underline: false, link: false, inEdit: false })
  const [linkOpen, setLinkOpen] = useState(false)
  const [url, setUrl] = useState("")
  const [error, setError] = useState<string | null>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const pendingRef = useRef<PendingLink | null>(null)

  useEffect(() => {
    const refresh = () => {
      const node = document.activeElement as HTMLElement | null
      const inEdit = Boolean(node?.closest(EDITABLE))
      setState({
        inEdit,
        bold: inEdit && document.queryCommandState("bold"),
        italic: inEdit && document.queryCommandState("italic"),
        underline: inEdit && document.queryCommandState("underline"),
        link: inEdit && Boolean(anchorOf(window.getSelection()?.anchorNode ?? null)),
      })
    }
    document.addEventListener("selectionchange", refresh)
    document.addEventListener("focusin", refresh)
    document.addEventListener("focusout", refresh)
    return () => {
      document.removeEventListener("selectionchange", refresh)
      document.removeEventListener("focusin", refresh)
      document.removeEventListener("focusout", refresh)
    }
  }, [])

  useEffect(() => {
    if (!linkOpen) return
    const onPointer = (event: MouseEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) cancelLink()
    }
    document.addEventListener("mousedown", onPointer)
    return () => document.removeEventListener("mousedown", onPointer)
  }, [linkOpen])

  const run = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    const host = editableOf(document.activeElement)
    if (host) emitInput(host)
  }

  const openLink = () => {
    if (linkOpen) {
      cancelLink()
      return
    }
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return
    const range = selection.getRangeAt(0)
    const host = editableOf(range.commonAncestorContainer)
    if (!host) return

    const existing = findAnchor(range, host)
    if (range.collapsed && !existing) {
      setError("Select the words you want to link first")
      setUrl("")
      setLinkOpen(true)
      return
    }

    const marker = document.createElement("span")
    marker.className = "nl-link-pending"
    if (existing) {
      existing.parentNode?.insertBefore(marker, existing)
      marker.appendChild(existing)
    } else {
      marker.appendChild(range.extractContents())
      range.insertNode(marker)
    }
    selection.removeAllRanges()

    pendingRef.current = { marker, host, existing }
    setError(null)
    setUrl(existing?.getAttribute("href") ?? "")
    setLinkOpen(true)
  }

  const cancelLink = () => {
    const pending = pendingRef.current
    if (pending?.marker.isConnected) unwrap(pending.marker)
    pendingRef.current = null
    setLinkOpen(false)
    setError(null)
  }

  const applyLink = () => {
    const pending = pendingRef.current
    if (!pending || !pending.marker.isConnected) {
      cancelLink()
      return
    }
    const href = normalizeHref(url)
    if (!href) {
      setError("Enter a URL")
      return
    }

    const { marker, host, existing } = pending
    let anchor: HTMLAnchorElement
    if (existing && marker.contains(existing)) {
      anchor = existing
      unwrap(marker)
    } else {
      marker.querySelectorAll("a").forEach((inner) => unwrap(inner))
      anchor = document.createElement("a")
      while (marker.firstChild) anchor.appendChild(marker.firstChild)
      marker.replaceWith(anchor)
    }
    anchor.setAttribute("href", href)
    anchor.setAttribute("target", "_blank")
    anchor.style.color = TEXT_LINK_COLOR
    anchor.style.textDecoration = "underline"

    pendingRef.current = null
    setLinkOpen(false)
    setError(null)

    host.focus()
    const selection = window.getSelection()
    if (selection) {
      const after = document.createRange()
      after.setStartAfter(anchor)
      after.collapse(true)
      selection.removeAllRanges()
      selection.addRange(after)
    }
    emitInput(host)
  }

  const removeLink = () => {
    const pending = pendingRef.current
    if (!pending) return
    const { marker, host, existing } = pending
    if (existing && marker.contains(existing)) unwrap(existing)
    unwrap(marker)
    pendingRef.current = null
    setLinkOpen(false)
    emitInput(host)
  }

  const hasPending = Boolean(pendingRef.current)
  const editingExisting = Boolean(pendingRef.current?.existing)

  return (
    <div className="nl-format-tools" ref={wrapRef}>
      <ToolbarGroup label="Format">
        <ToolbarButton title="Bold" active={state.bold} disabled={!state.inEdit} onClick={() => run("bold")}>
          <Bold size={15} />
        </ToolbarButton>
        <ToolbarButton title="Italic" active={state.italic} disabled={!state.inEdit} onClick={() => run("italic")}>
          <Italic size={15} />
        </ToolbarButton>
        <ToolbarButton title="Underline" active={state.underline} disabled={!state.inEdit} onClick={() => run("underline")}>
          <Underline size={15} />
        </ToolbarButton>
        <ToolbarButton title={state.link ? "Edit link" : "Link"} active={linkOpen || state.link} disabled={!state.inEdit && !linkOpen} onClick={openLink}>
          <Link2 size={15} />
        </ToolbarButton>
      </ToolbarGroup>
      {linkOpen ? (
        <form
          className="nl-link-popover"
          onSubmit={(event) => {
            event.preventDefault()
            applyLink()
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.preventDefault()
              event.stopPropagation()
              cancelLink()
            } else if (event.key === "Enter") {
              event.preventDefault()
              event.stopPropagation()
              applyLink()
            }
          }}
        >
          {hasPending ? (
            <>
              <div className="nl-link-popover-row">
                <input
                  autoFocus
                  value={url}
                  onChange={(event) => {
                    setUrl(event.target.value)
                    setError(null)
                  }}
                  placeholder="https://example.com"
                  aria-label="Link URL"
                />
                <button type="submit">{editingExisting ? "Update" : "Add"}</button>
              </div>
              <div className="nl-link-popover-foot">
                {error ? <span className="nl-link-popover-error">{error}</span> : <span>Enter to apply · Esc to cancel</span>}
                {editingExisting ? (
                  <button type="button" className="nl-link-popover-remove" onClick={removeLink}>
                    Remove link
                  </button>
                ) : null}
              </div>
            </>
          ) : (
            <div className="nl-link-popover-foot">
              <span className="nl-link-popover-error">{error}</span>
            </div>
          )}
        </form>
      ) : null}
    </div>
  )
}
