"use client"

import type { ReactNode } from "react"
import { Bold, Italic, Underline, Link, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Undo2, Redo2, Maximize2, Minimize2 } from "lucide-react"

interface EditorToolbarProps {
  isFullscreen?: boolean
  onToggleFullscreen?: () => void
  extra?: ReactNode
  onAlign?: (alignment: "left" | "center" | "right") => void
  activeAlign?: "left" | "center" | "right"
}

export function EditorToolbar({ isFullscreen, onToggleFullscreen, extra, onAlign, activeAlign }: EditorToolbarProps) {
  const exec = (command: string, value?: string) => {
    document.execCommand(command, false, value)
  }

  const handleLink = () => {
    const url = window.prompt("Enter URL:")
    if (url) exec("createLink", url)
  }

  return (
    <div className="nl-toolbar">
      <div className="nl-toolbar-group">
        <button type="button" className="nl-toolbar-btn" onClick={() => exec("undo")} title="Undo">
          <Undo2 />
        </button>
        <button type="button" className="nl-toolbar-btn" onClick={() => exec("redo")} title="Redo">
          <Redo2 />
        </button>
      </div>

      <div className="nl-toolbar-separator" />

      <div className="nl-toolbar-group">
        <button type="button" className="nl-toolbar-btn" onClick={() => exec("bold")} title="Bold">
          <Bold />
        </button>
        <button type="button" className="nl-toolbar-btn" onClick={() => exec("italic")} title="Italic">
          <Italic />
        </button>
        <button type="button" className="nl-toolbar-btn" onClick={() => exec("underline")} title="Underline">
          <Underline />
        </button>
        <button type="button" className="nl-toolbar-btn" onClick={handleLink} title="Insert Link">
          <Link />
        </button>
        <button type="button" className="nl-toolbar-btn" onClick={() => exec("insertUnorderedList")} title="Bulleted list">
          <List />
        </button>
        <button type="button" className="nl-toolbar-btn" onClick={() => exec("insertOrderedList")} title="Numbered list">
          <ListOrdered />
        </button>
      </div>

      <div className="nl-toolbar-separator" />

      <div className="nl-toolbar-group">
        <button type="button" className={`nl-toolbar-btn ${activeAlign === "left" ? "nl-active" : ""}`} onClick={() => onAlign?.("left")} title="Align left">
          <AlignLeft />
        </button>
        <button type="button" className={`nl-toolbar-btn ${activeAlign === "center" ? "nl-active" : ""}`} onClick={() => onAlign?.("center")} title="Align center">
          <AlignCenter />
        </button>
        <button type="button" className={`nl-toolbar-btn ${activeAlign === "right" ? "nl-active" : ""}`} onClick={() => onAlign?.("right")} title="Align right">
          <AlignRight />
        </button>
      </div>

      <div className="nl-toolbar-spacer" />
      {extra}
      {onToggleFullscreen && (
        <>
          <div className="nl-toolbar-separator" />
          <button
            className={`nl-toolbar-btn ${isFullscreen ? "nl-active" : ""}`}
            onClick={onToggleFullscreen}
            title={isFullscreen ? "Exit Full Screen" : "Enter Full Screen"}
          >
            {isFullscreen ? <Minimize2 /> : <Maximize2 />}
          </button>
        </>
      )}
    </div>
  )
}
