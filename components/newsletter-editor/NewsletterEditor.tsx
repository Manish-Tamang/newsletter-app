"use client"

import {
  useState,
  useCallback,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react"
import { Mail } from "lucide-react"
import { EditorToolbar } from "./EditorToolbar"
import { BlockRenderer } from "./BlockRenderer"
import { AddBlockMenu } from "./AddBlockMenu"
import {
  type NewsletterBlock,
  type BlockType,
  type BlockData,
  BLOCK_TEMPLATES,
  generateBlockId,
  blocksToHtml,
} from "./types"
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
    const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)
    const [isFullscreen, setIsFullscreen] = useState(false)

    const emitHtml = useCallback(
      (updatedBlocks: NewsletterBlock[]) => {
        if (typeof window !== "undefined") {
          localStorage.setItem(storageKey, JSON.stringify(updatedBlocks))
        }
        if (onChange) {
          onChange(blocksToHtml(updatedBlocks))
        }
      },
      [onChange, storageKey]
    )

    const exportHtml = useCallback((): Promise<string | null> => {
      return Promise.resolve(blocks.length > 0 ? blocksToHtml(blocks) : null)
    }, [blocks])

    useImperativeHandle(ref, () => ({
      exportHtml,
    }))

    useEffect(() => {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as NewsletterBlock[]
          if (Array.isArray(parsed) && parsed.length > 0) {
            setBlocks(parsed)
            if (onChange) {
              onChange(blocksToHtml(parsed))
            }
          }
        } catch (e) {
          console.error("Failed to parse saved newsletter blocks", e)
        }
      }
    }, [storageKey, onChange])

    const addBlock = useCallback(
      (type: BlockType, afterIndex?: number) => {
        const newBlock: NewsletterBlock = {
          id: generateBlockId(),
          type,
          data: BLOCK_TEMPLATES[type](),
        }
        setBlocks((prev) => {
          const insertAt = afterIndex !== undefined ? afterIndex + 1 : prev.length
          const updated = [...prev.slice(0, insertAt), newBlock, ...prev.slice(insertAt)]
          emitHtml(updated)
          return updated
        })
        setSelectedBlockId(newBlock.id)
      },
      [emitHtml]
    )

    const updateBlock = useCallback(
      (blockId: string, data: Partial<BlockData>) => {
        setBlocks((prev) => {
          const updated = prev.map((b) => (b.id === blockId ? { ...b, data: { ...b.data, ...data } } : b))
          emitHtml(updated)
          return updated
        })
      },
      [emitHtml]
    )

    const deleteBlock = useCallback(
      (blockId: string) => {
        setBlocks((prev) => {
          const updated = prev.filter((b) => b.id !== blockId)
          emitHtml(updated)
          return updated
        })
        setSelectedBlockId(null)
      },
      [emitHtml]
    )

    const duplicateBlock = useCallback(
      (blockId: string) => {
        setBlocks((prev) => {
          const idx = prev.findIndex((b) => b.id === blockId)
          if (idx === -1) return prev
          const clone: NewsletterBlock = {
            ...prev[idx],
            id: generateBlockId(),
            data: { ...prev[idx].data },
          }
          const updated = [...prev.slice(0, idx + 1), clone, ...prev.slice(idx + 1)]
          emitHtml(updated)
          return updated
        })
      },
      [emitHtml]
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
          emitHtml(updated)
          return updated
        })
      },
      [emitHtml]
    )

    const handleCanvasClick = (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest(".nl-block-wrapper")) return
      if ((e.target as HTMLElement).closest(".nl-add-block-zone")) return
      setSelectedBlockId(null)
    }

    return (
      <div className={`nl-editor-wrapper ${className || ""} ${isFullscreen ? "nl-editor-fullscreen" : ""}`}>
        <EditorToolbar isFullscreen={isFullscreen} onToggleFullscreen={() => setIsFullscreen(!isFullscreen)} />
        <div className="nl-editor-canvas-area" onClick={handleCanvasClick}>
          <div className="nl-editor-canvas">
            {blocks.length === 0 ? (
              <div className="nl-empty-state">
                <div className="nl-empty-state-icon">
                  <Mail size={24} />
                </div>
                <h3>Start building your newsletter</h3>
                <p>Click the button below to add your first content block</p>
                <div style={{ marginTop: "20px" }}>
                  <AddBlockMenu onAdd={(type) => addBlock(type)} alwaysVisible />
                </div>
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
                      onSelect={setSelectedBlockId}
                    />
                    <AddBlockMenu onAdd={(type) => addBlock(type, index)} />
                  </div>
                ))}
                <AddBlockMenu onAdd={(type) => addBlock(type)} alwaysVisible />
              </>
            )}
          </div>
        </div>
      </div>
    )
  }
)
