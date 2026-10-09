"use client"

import {
  useState,
  useCallback,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react"
import { Mail } from "lucide-react"
import { EditorToolbar } from "./EditorToolbar"
import { BlockRenderer } from "./BlockRenderer"
import { AddBlockMenu } from "./AddBlockMenu"
import { CanvasSettings } from "./CanvasSettings"
import { LayoutPicker } from "./LayoutPicker"
import { InspectorProvider, type InspectorTab } from "./inspector-context"
import {
  type NewsletterBlock,
  type BlockType,
  type BlockData,
  BLOCK_TEMPLATES,
  BLOCK_META,
  generateBlockId,
  type Align,
} from "./types"
import { blocksToHtml } from "./html"
import { DEFAULT_THEME, parseEditorDocument, type EmailTheme } from "./theme"
import { createPreset, type PresetId } from "./presets"
import { alignBlock, inferAlign, withThemeDefaults } from "./stack"
import { EMAIL_STORAGE_KEYS } from "@/lib/email-content"
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
    const [blocks, setBlocks] = useState<NewsletterBlock[]>([])
    const [theme, setTheme] = useState<EmailTheme>(DEFAULT_THEME)
    const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [inspectorTab, setInspectorTab] = useState<InspectorTab>("email")
    const blocksRef = useRef(blocks)
    const themeRef = useRef(theme)
    blocksRef.current = blocks
    themeRef.current = theme

    const persist = useCallback(
      (nextBlocks: NewsletterBlock[], nextTheme: EmailTheme) => {
        if (typeof window !== "undefined") {
          localStorage.setItem(
            storageKey,
            JSON.stringify({ version: 2, theme: nextTheme, blocks: nextBlocks })
          )
        }
        onChange?.(blocksToHtml(nextBlocks, nextTheme))
      },
      [onChange, storageKey]
    )

    const exportHtml = useCallback((): Promise<string | null> => {
      return Promise.resolve(blocks.length > 0 ? blocksToHtml(blocks, theme) : null)
    }, [blocks, theme])

    useImperativeHandle(ref, () => ({
      exportHtml,
    }))

    useEffect(() => {
      const saved = localStorage.getItem(storageKey)
      if (!saved) return
      const doc = parseEditorDocument(saved)
      if (!doc || doc.blocks.length === 0) return
      let explicitAlign = false
      try {
        const raw = JSON.parse(saved) as { theme?: { align?: string } }
        explicitAlign = !Array.isArray(raw) && typeof raw?.theme?.align === "string"
      } catch {
        explicitAlign = false
      }
      const theme = explicitAlign ? doc.theme : { ...doc.theme, align: inferAlign(doc.blocks) }
      setBlocks(doc.blocks)
      setTheme(theme)
      onChange?.(blocksToHtml(doc.blocks, theme))
    }, [storageKey])

    const addBlock = useCallback(
      (type: BlockType, afterIndex?: number) => {
        const data = withThemeDefaults(type, BLOCK_TEMPLATES[type](), themeRef.current)
        const newBlock: NewsletterBlock = {
          id: generateBlockId(),
          type,
          data,
        }
        setBlocks((prev) => {
          const insertAt = afterIndex !== undefined ? afterIndex + 1 : prev.length
          const updated = [...prev.slice(0, insertAt), newBlock, ...prev.slice(insertAt)]
          persist(updated, themeRef.current)
          return updated
        })
        setSelectedBlockId(newBlock.id)
        setInspectorTab("block")
      },
      [persist]
    )

    const updateBlock = useCallback(
      (blockId: string, data: Partial<BlockData>) => {
        setBlocks((prev) => {
          const updated = prev.map((b) =>
            b.id === blockId ? { ...b, data: { ...b.data, ...data } as BlockData } : b
          )
          persist(updated, themeRef.current)
          return updated
        })
      },
      [persist]
    )

    const deleteBlock = useCallback(
      (blockId: string) => {
        setBlocks((prev) => {
          const updated = prev.filter((b) => b.id !== blockId)
          persist(updated, themeRef.current)
          return updated
        })
        setSelectedBlockId(null)
        setInspectorTab("email")
      },
      [persist]
    )

    const duplicateBlock = useCallback(
      (blockId: string) => {
        setBlocks((prev) => {
          const idx = prev.findIndex((b) => b.id === blockId)
          if (idx === -1) return prev
          const source = prev[idx]
          const clone: NewsletterBlock = {
            ...source,
            id: generateBlockId(),
            data: { ...source.data },
          }
          const updated = [...prev.slice(0, idx + 1), clone, ...prev.slice(idx + 1)]
          persist(updated, themeRef.current)
          return updated
        })
      },
      [persist]
    )

    const moveBlock = useCallback(
      (blockId: string, direction: "up" | "down") => {
        setBlocks((prev) => {
          const idx = prev.findIndex((b) => b.id === blockId)
          if (idx === -1) return prev
          const swapIdx = direction === "up" ? idx - 1 : idx + 1
          if (swapIdx < 0 || swapIdx >= prev.length) return prev
          const updated = [...prev]
          ;[updated[idx], updated[swapIdx]] = [updated[swapIdx], updated[idx]]
          persist(updated, themeRef.current)
          return updated
        })
      },
      [persist]
    )

    const updateTheme = useCallback(
      (partial: Partial<EmailTheme>) => {
        const prev = themeRef.current
        const next = { ...prev, ...partial }
        let nextBlocks = blocksRef.current
        if (partial.align && partial.align !== prev.align) {
          nextBlocks = nextBlocks.map((block) => alignBlock(block, partial.align as Align))
          setBlocks(nextBlocks)
        }
        setTheme(next)
        persist(nextBlocks, next)
      },
      [persist]
    )

    const alignSelection = useCallback(
      (alignment: Align) => {
        const selected = blocksRef.current.find((block) => block.id === selectedBlockId)
        if (selected && "alignment" in selected.data) {
          updateBlock(selected.id, { alignment })
          return
        }
        updateTheme({ align: alignment })
      },
      [selectedBlockId, updateBlock, updateTheme]
    )

    const applyPreset = useCallback(
      (id: PresetId) => {
        if (blocksRef.current.length > 0) {
          const ok = window.confirm("Replace the current email with this layout?")
          if (!ok) return
        }
        const preset = createPreset(id)
        setBlocks(preset.blocks)
        setTheme(preset.theme)
        setSelectedBlockId(null)
        setInspectorTab("email")
        persist(preset.blocks, preset.theme)
      },
      [persist]
    )

    const handleCanvasPointerDown = (e: React.MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest(".nl-editor-canvas-area")) return
      if (target.closest(".nl-block-wrapper")) return
      if (target.closest(".nl-add-block-zone")) return
      if (target.closest(".nl-add-menu")) return
      if (target.closest(".nl-layout-picker")) return
      if (target.closest(".nl-inspector")) return
      setSelectedBlockId(null)
      setInspectorTab("email")
    }

    const selected = blocks.find((block) => block.id === selectedBlockId) || null

    const frameStyle = {
      ["--nl-font" as string]:
        theme.font === "georgia"
          ? "Georgia, 'Times New Roman', Times, serif"
          : theme.font === "arial"
            ? "Arial, Helvetica, sans-serif"
            : theme.font === "inter"
              ? "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
              : "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      ["--nl-heading" as string]: theme.headingColor,
      ["--nl-text" as string]: theme.textColor,
      ["--nl-muted" as string]: theme.mutedColor,
      ["--nl-link" as string]: theme.linkColor,
      ["--nl-accent" as string]: theme.accentColor,
      ["--nl-pad-x" as string]: `${theme.paddingX}px`,
      background: theme.cardBackground,
      borderRadius: theme.cardRadius,
      color: theme.textColor,
    }

    return (
      <InspectorProvider tab={inspectorTab}>
        <div className={`nl-editor-wrapper ${className || ""} ${isFullscreen ? "nl-editor-fullscreen" : ""}`}>
          <EditorToolbar
            isFullscreen={isFullscreen}
            onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
            onAlign={alignSelection}
            activeAlign={
              selected && "alignment" in selected.data ? selected.data.alignment : theme.align
            }
            extra={<LayoutPicker variant="toolbar" onPick={applyPreset} />}
          />
          <div
            className="nl-editor-canvas-area"
            style={{ background: theme.pageBackground }}
            onMouseDown={handleCanvasPointerDown}
          >
            <div className="nl-editor-canvas">
              <div className="nl-email-frame" style={frameStyle}>
                {theme.showAccentBar ? <div className="nl-accent-bar" /> : null}
                {blocks.length === 0 ? (
                  <div className="nl-empty-state">
                    <div className="nl-empty-state-icon">
                      <Mail size={20} />
                    </div>
                    <h3>Start on the canvas</h3>
                    <p>Add a logo, a heading, and text. Every block uses the same margin, so the email stays aligned.</p>
                    <div className="nl-empty-add">
                      <AddBlockMenu onAdd={(type) => addBlock(type)} alwaysVisible />
                    </div>
                    <LayoutPicker variant="empty" onPick={applyPreset} />
                  </div>
                ) : (
                  <>
                    {blocks.map((block, index) => (
                      <div key={block.id}>
                        <BlockRenderer
                          block={block}
                          onUpdate={updateBlock}
                          onDelete={deleteBlock}
                          onDuplicate={duplicateBlock}
                          onMoveUp={(id) => moveBlock(id, "up")}
                          onMoveDown={(id) => moveBlock(id, "down")}
                          isFirst={index === 0}
                          isLast={index === blocks.length - 1}
                          isSelected={selectedBlockId === block.id}
                          previousType={index > 0 ? blocks[index - 1].type : null}
                          onSelect={(id) => {
                            setSelectedBlockId(id)
                            setInspectorTab("block")
                          }}
                        />
                        {index < blocks.length - 1 ? <AddBlockMenu onAdd={(type) => addBlock(type, index)} /> : null}
                      </div>
                    ))}
                    <AddBlockMenu onAdd={(type) => addBlock(type)} alwaysVisible />
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="nl-inspector">
            <div className="nl-inspector-bar">
              <button
                type="button"
                className={inspectorTab === "email" ? "nl-active" : ""}
                onClick={() => setInspectorTab("email")}
              >
                Email
              </button>
              <button
                type="button"
                className={inspectorTab === "block" ? "nl-active" : ""}
                onClick={() => setInspectorTab("block")}
                disabled={!selected}
              >
                {selected ? BLOCK_META[selected.type].label : "Block"}
              </button>
            </div>
            <div className="nl-inspector-body">
              {inspectorTab === "email" ? <CanvasSettings theme={theme} onChange={updateTheme} /> : null}
              <div id="nl-inspector-slot" hidden={inspectorTab !== "block"} />
              {inspectorTab === "block" && !selected ? (
                <p className="nl-inspector-empty">Select a block to edit its settings.</p>
              ) : null}
            </div>
          </div>
        </div>
      </InspectorProvider>
    )
  }
)
