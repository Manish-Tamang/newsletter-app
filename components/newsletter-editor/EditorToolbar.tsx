"use client"

import { Bold, Italic, Underline, Link, AlignLeft, AlignCenter, AlignRight, Undo2, Redo2, Maximize2, Minimize2 } from "lucide-react"

interface EditorToolbarProps {
  isFullscreen?: boolean
  onToggleFullscreen?: () => void
}

export function EditorToolbar({ isFullscreen, onToggleFullscreen }: EditorToolbarProps) {
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
        <button className="nl-toolbar-btn" onClick={() => exec("undo")} title="Undo">
          <Undo2 />
        </button>
        <button className="nl-toolbar-btn" onClick={() => exec("redo")} title="Redo">
          <Redo2 />
        </button>
      </div>

      <div className="nl-toolbar-separator" />

      <div className="nl-toolbar-group">
        <button className="nl-toolbar-btn" onClick={() => exec("bold")} title="Bold">
          <Bold />
        </button>
        <button className="nl-toolbar-btn" onClick={() => exec("italic")} title="Italic">
          <Italic />
        </button>
        <button className="nl-toolbar-btn" onClick={() => exec("underline")} title="Underline">
          <Underline />
        </button>
        <button className="nl-toolbar-btn" onClick={handleLink} title="Insert Link">
          <Link />
        </button>
      </div>

      <div className="nl-toolbar-separator" />

      <div className="nl-toolbar-group">
        <button className="nl-toolbar-btn" onClick={() => exec("justifyLeft")} title="Align Left">
          <AlignLeft />
        </button>
        <button className="nl-toolbar-btn" onClick={() => exec("justifyCenter")} title="Align Center">
          <AlignCenter />
        </button>
        <button className="nl-toolbar-btn" onClick={() => exec("justifyRight")} title="Align Right">
          <AlignRight />
        </button>
      </div>

      {onToggleFullscreen && (
        <>
          <div className="nl-toolbar-separator" style={{ marginLeft: "auto" }} />
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
