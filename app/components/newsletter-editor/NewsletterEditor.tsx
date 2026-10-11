"use client"

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react"
import { EditorToolbar } from "./toolbar/EditorToolbar"
import { BlockRenderer } from "./canvas/BlockRenderer"
import { AddBlockMenu } from "./canvas/AddBlockMenu"
import { BlockPalette } from "./canvas/BlockPalette"
import { EmptyCanvas } from "./canvas/EmptyCanvas"
import { InspectorPanel } from "./inspector/InspectorPanel"
import type { InspectorTab } from "./inspector/inspector-context"
import { FONT_STACKS } from "./core/theme"
import { type Align, type BlockType } from "./core/types"
import { hasAlignment } from "./core/stack"
import { useEditorDocument } from "./hooks/useEditorDocument"
import { EMAIL_STORAGE_KEYS } from "@/lib/email-content"
import type { PresetId } from "./core/presets"
import "./newsletter-editor.css"

export interface NewsletterEditorHandle {
  exportHtml: () => Promise<string | null>
}

interface NewsletterEditorProps {
  onChange?: (html: string) => void
  className?: string
  storageKey?: string
}

export const NewsletterEditor = forwardRef<NewsletterEditorHandle, NewsletterEditorProps>(
  function NewsletterEditor({ onChange, className, storageKey = EMAIL_STORAGE_KEYS.campaignBlocks }, ref) {
    const doc = useEditorDocument({ storageKey, onChange })
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [inspectorTab, setInspectorTab] = useState<InspectorTab>("email")
    const [previewHtml, setPreviewHtml] = useState<string | null>(null)

    const selectedIndex = useMemo(
      () => (doc.selectedId ? doc.blocks.findIndex((block) => block.id === doc.selectedId) : -1),
      [doc.blocks, doc.selectedId]
    )

    useImperativeHandle(ref, () => ({
      exportHtml: async () => doc.exportHtml(),
    }))

    useEffect(() => {
      if (!doc.selectedId) setInspectorTab("email")
    }, [doc.selectedId])

    const confirmReplace = useCallback(() => {
      if (doc.blocks.length === 0) return true
      return window.confirm("Replace the current email?")
    }, [doc.blocks.length])

    const addBlock = useCallback(
      (type: BlockType, afterIndex?: number) => {
        const index = afterIndex === undefined ? (selectedIndex >= 0 ? selectedIndex + 1 : undefined) : afterIndex + 1
        doc.insertBlock(type, index)
        setInspectorTab("block")
      },
      [doc, selectedIndex]
    )

    const selectBlock = useCallback(
      (id: string) => {
        doc.setSelectedId(id)
        setInspectorTab("block")
      },
      [doc]
    )

    const clearSelection = useCallback(() => {
      doc.setSelectedId(null)
      setInspectorTab("email")
    }, [doc])

    const applyPreset = useCallback(
      (id: PresetId) => {
        if (!confirmReplace()) return
        doc.applyPreset(id)
        setInspectorTab("email")
      },
      [confirmReplace, doc]
    )

    const startBlank = useCallback(() => {
      if (!confirmReplace()) return
      doc.startBlank()
      setInspectorTab("email")
    }, [confirmReplace, doc])

    const alignSelection = useCallback(
      (alignment: Align) => {
        const selected = doc.selectedBlock
        if (selected && hasAlignment(selected.data)) {
          doc.updateBlock(selected.id, { alignment })
          return
        }
        doc.updateTheme({ align: alignment })
      },
      [doc]
    )

    useEffect(() => {
      const onKey = (event: KeyboardEvent) => {
        const target = event.target as HTMLElement | null
        const inField = Boolean(target?.closest("input, textarea, [contenteditable='true']"))
        const mod = event.metaKey || event.ctrlKey
        if (mod && event.key.toLowerCase() === "z") {
          event.preventDefault()
          if (event.shiftKey) doc.redo()
          else doc.undo()
          return
        }
        if (mod && event.key.toLowerCase() === "y") {
          event.preventDefault()
          doc.redo()
          return
        }
        if (mod && event.key.toLowerCase() === "d" && doc.selectedId) {
          event.preventDefault()
          doc.duplicateBlock(doc.selectedId)
          return
        }
        if (inField) return
        if ((event.key === "Delete" || event.key === "Backspace") && doc.selectedId) {
          event.preventDefault()
          doc.removeBlock(doc.selectedId)
        }
        if (event.altKey && event.key === "ArrowUp" && doc.selectedId) {
          event.preventDefault()
          doc.moveBlock(doc.selectedId, "up")
        }
        if (event.altKey && event.key === "ArrowDown" && doc.selectedId) {
          event.preventDefault()
          doc.moveBlock(doc.selectedId, "down")
        }
        if (event.key === "Escape") {
          clearSelection()
          setPreviewHtml(null)
        }
      }
      window.addEventListener("keydown", onKey)
      return () => window.removeEventListener("keydown", onKey)
    }, [clearSelection, doc])

    const handleCanvasPointerDown = (event: React.MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest(".nl-editor-canvas-area")) return
      if (target.closest(".nl-block-wrapper")) return
      if (target.closest(".nl-add-block-zone")) return
      if (target.closest(".nl-add-menu")) return
      if (target.closest(".nl-layout-picker")) return
      if (target.closest(".nl-inspector")) return
      if (target.closest(".nl-palette")) return
      clearSelection()
    }

    const frameStyle = {
      ["--nl-font" as string]: FONT_STACKS[doc.theme.font],
      ["--nl-heading" as string]: doc.theme.headingColor,
      ["--nl-text" as string]: doc.theme.textColor,
      ["--nl-muted" as string]: doc.theme.mutedColor,
      ["--nl-link" as string]: doc.theme.linkColor,
      ["--nl-accent" as string]: doc.theme.accentColor,
      ["--nl-pad-x" as string]: `${doc.theme.paddingX}px`,
      background: doc.theme.cardBackground,
      borderRadius: doc.theme.cardRadius,
      color: doc.theme.textColor,
    }

    return (
      <div className={`nl-editor-wrapper ${className || ""} ${isFullscreen ? "nl-editor-fullscreen" : ""}`}>
        <EditorToolbar
          isFullscreen={isFullscreen}
          onToggleFullscreen={() => setIsFullscreen((value) => !value)}
          onAlign={alignSelection}
          emailAlign={doc.theme.align}
          selected={doc.selectedBlock}
          isFirst={selectedIndex <= 0}
          isLast={selectedIndex === doc.blocks.length - 1}
          canUndo={doc.canUndo}
          canRedo={doc.canRedo}
          onUndo={doc.undo}
          onRedo={doc.redo}
          onMoveUp={() => doc.selectedId && doc.moveBlock(doc.selectedId, "up")}
          onMoveDown={() => doc.selectedId && doc.moveBlock(doc.selectedId, "down")}
          onDuplicate={() => doc.selectedId && doc.duplicateBlock(doc.selectedId)}
          onDelete={() => {
            if (!doc.selectedId) return
            doc.removeBlock(doc.selectedId)
          }}
          onPreview={() =>
            setPreviewHtml(
              doc.exportHtml() ||
                "<p style='padding:32px;font-family:sans-serif;color:#71717a;text-align:center'>Nothing to preview yet. Add a block or pick a layout.</p>"
            )
          }
          onPickLayout={applyPreset}
          onBlank={startBlank}
          saveStatus={doc.saveStatus}
        />
        <div className="nl-editor-body">
          <BlockPalette onAdd={(type) => addBlock(type)} />
          <div
            className="nl-editor-canvas-area"
            style={{ background: doc.theme.pageBackground }}
            onMouseDown={handleCanvasPointerDown}
          >
            <div className="nl-editor-canvas">
              <div className="nl-email-frame" style={frameStyle}>
                {doc.theme.showAccentBar ? <div className="nl-accent-bar" /> : null}
                {doc.blocks.length === 0 ? (
                  <EmptyCanvas onAdd={(type) => addBlock(type)} onPick={applyPreset} />
                ) : (
                  <>
                    {doc.blocks.map((block, index) => (
                      <div key={block.id}>
                        <BlockRenderer
                          block={block}
                          onUpdate={(data, options) => doc.updateBlock(block.id, data, options)}
                          onDelete={doc.removeBlock}
                          onDuplicate={doc.duplicateBlock}
                          onMoveUp={(id) => doc.moveBlock(id, "up")}
                          onMoveDown={(id) => doc.moveBlock(id, "down")}
                          isFirst={index === 0}
                          isLast={index === doc.blocks.length - 1}
                          isSelected={doc.selectedId === block.id}
                          previousType={index > 0 ? doc.blocks[index - 1].type : null}
                          onSelect={selectBlock}
                        />
                        {index < doc.blocks.length - 1 ? <AddBlockMenu onAdd={(type) => addBlock(type, index)} /> : null}
                      </div>
                    ))}
                    <AddBlockMenu onAdd={(type) => addBlock(type, doc.blocks.length - 1)} alwaysVisible />
                  </>
                )}
              </div>
            </div>
          </div>
          <InspectorPanel
            tab={inspectorTab}
            onTabChange={setInspectorTab}
            theme={doc.theme}
            selected={doc.selectedBlock}
            onThemeChange={doc.updateTheme}
            onUpdateBlock={(data, options) => {
              if (!doc.selectedId) return
              doc.updateBlock(doc.selectedId, data, options)
            }}
          />
        </div>
        {previewHtml ? (
          <div className="nl-preview-layer" onClick={() => setPreviewHtml(null)}>
            <div className="nl-preview-dialog" onClick={(event) => event.stopPropagation()}>
              <div className="nl-preview-head">
                <div>
                  <strong>Preview</strong>
                  <span>How the email will look in a client</span>
                </div>
                <button type="button" onClick={() => setPreviewHtml(null)}>
                  Close
                </button>
              </div>
              <iframe title="Email preview" className="nl-preview-frame" srcDoc={previewHtml} />
            </div>
          </div>
        ) : null}
      </div>
    )
  }
)
