"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { BlockData, BlockType, NewsletterBlock } from "../core/types"
import type { EmailTheme } from "../core/theme"
import { DEFAULT_THEME, parseEditorDocument } from "../core/theme"
import { blocksToHtml } from "../core/html"
import { createPreset, type PresetId } from "../core/presets"
import { inferAlign } from "../core/stack"
import {
  createEmptyState,
  duplicateBlock as duplicateBlockOp,
  insertBlock as insertBlockOp,
  moveBlock as moveBlockOp,
  removeBlock as removeBlockOp,
  reorderBlocks as reorderBlocksOp,
  updateBlockData,
  updateTheme as updateThemeOp,
  type EditorState,
} from "../core/document"

const HISTORY_LIMIT = 100
const TYPING_COALESCE_MS = 700
const PERSIST_DEBOUNCE_MS = 350

export type SaveStatus = "idle" | "dirty" | "saved"

interface HistoryEntry {
  state: EditorState
  typingKey: string | null
  at: number
}

interface UseEditorDocumentOptions {
  storageKey: string
  onChange?: (html: string) => void
}

export function useEditorDocument({ storageKey, onChange }: UseEditorDocumentOptions) {
  const [present, setPresent] = useState<EditorState>(() => createEmptyState())
  const pastRef = useRef<HistoryEntry[]>([])
  const futureRef = useRef<EditorState[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle")
  const [hydrated, setHydrated] = useState(false)
  const [historySize, setHistorySize] = useState({ past: 0, future: 0 })

  const presentRef = useRef(present)
  presentRef.current = present
  const lastTypingRef = useRef<{ key: string; at: number } | null>(null)
  const persistTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  useEffect(() => {
    if (typeof window === "undefined") return
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      const doc = parseEditorDocument(saved)
      if (doc && doc.blocks.length > 0) {
        let explicitAlign = false
        try {
          const raw = JSON.parse(saved) as { theme?: { align?: string } }
          explicitAlign = !Array.isArray(raw) && typeof raw?.theme?.align === "string"
        } catch {
          explicitAlign = false
        }
        const theme = explicitAlign ? doc.theme : { ...doc.theme, align: inferAlign(doc.blocks) }
        const state = { blocks: doc.blocks, theme }
        setPresent(state)
        presentRef.current = state
        onChangeRef.current?.(blocksToHtml(state.blocks, state.theme))
      }
    }
    setHydrated(true)
  }, [storageKey])

  const schedulePersist = useCallback(
    (state: EditorState) => {
      setSaveStatus("dirty")
      if (persistTimerRef.current) clearTimeout(persistTimerRef.current)
      persistTimerRef.current = setTimeout(() => {
        if (typeof window !== "undefined") {
          localStorage.setItem(storageKey, JSON.stringify({ version: 2, theme: state.theme, blocks: state.blocks }))
        }
        onChangeRef.current?.(state.blocks.length > 0 ? blocksToHtml(state.blocks, state.theme) : "")
        setSaveStatus("saved")
      }, PERSIST_DEBOUNCE_MS)
    },
    [storageKey]
  )

  useEffect(() => {
    return () => {
      if (persistTimerRef.current) clearTimeout(persistTimerRef.current)
    }
  }, [])

  const commit = useCallback(
    (next: EditorState, typingKey: string | null = null) => {
      const current = presentRef.current
      if (next === current) return
      const now = Date.now()
      const coalesce =
        typingKey !== null &&
        lastTypingRef.current !== null &&
        lastTypingRef.current.key === typingKey &&
        now - lastTypingRef.current.at < TYPING_COALESCE_MS

      if (!coalesce) {
        pastRef.current.push({ state: current, typingKey, at: now })
        if (pastRef.current.length > HISTORY_LIMIT) pastRef.current.shift()
        futureRef.current = []
      }
      lastTypingRef.current = typingKey ? { key: typingKey, at: now } : null
      presentRef.current = next
      setPresent(next)
      setHistorySize({ past: pastRef.current.length, future: futureRef.current.length })
      schedulePersist(next)
    },
    [schedulePersist]
  )

  const undo = useCallback(() => {
    const entry = pastRef.current.pop()
    if (!entry) return
    futureRef.current.unshift(presentRef.current)
    presentRef.current = entry.state
    lastTypingRef.current = null
    setPresent(entry.state)
    setHistorySize({ past: pastRef.current.length, future: futureRef.current.length })
    schedulePersist(entry.state)
  }, [schedulePersist])

  const redo = useCallback(() => {
    const next = futureRef.current.shift()
    if (!next) return
    pastRef.current.push({ state: presentRef.current, typingKey: null, at: Date.now() })
    presentRef.current = next
    lastTypingRef.current = null
    setPresent(next)
    setHistorySize({ past: pastRef.current.length, future: futureRef.current.length })
    schedulePersist(next)
  }, [schedulePersist])

  const insertBlock = useCallback(
    (type: BlockType, index?: number) => {
      const result = insertBlockOp(presentRef.current, type, index)
      commit(result.state)
      setSelectedId(result.block.id)
      return result.block
    },
    [commit]
  )

  const updateBlock = useCallback(
    (id: string, patch: Partial<BlockData>, options?: { typing?: boolean }) => {
      const next = updateBlockData(presentRef.current, id, patch)
      commit(next, options?.typing ? `${id}:${Object.keys(patch).join(",")}` : null)
    },
    [commit]
  )

  const removeBlock = useCallback(
    (id: string) => {
      const current = presentRef.current
      const index = current.blocks.findIndex((block) => block.id === id)
      const next = removeBlockOp(current, id)
      commit(next)
      if (selectedId === id) {
        const neighbor = next.blocks[Math.min(index, next.blocks.length - 1)]
        setSelectedId(neighbor ? neighbor.id : null)
      }
    },
    [commit, selectedId]
  )

  const duplicateBlock = useCallback(
    (id: string) => {
      const result = duplicateBlockOp(presentRef.current, id)
      commit(result.state)
      if (result.block) setSelectedId(result.block.id)
    },
    [commit]
  )

  const moveBlock = useCallback(
    (id: string, direction: "up" | "down") => {
      commit(moveBlockOp(presentRef.current, id, direction))
    },
    [commit]
  )

  const reorderBlocks = useCallback(
    (from: number, to: number) => {
      commit(reorderBlocksOp(presentRef.current, from, to))
    },
    [commit]
  )

  const updateTheme = useCallback(
    (patch: Partial<EmailTheme>, options?: { typing?: boolean }) => {
      commit(updateThemeOp(presentRef.current, patch), options?.typing ? `theme:${Object.keys(patch).join(",")}` : null)
    },
    [commit]
  )

  const replaceDocument = useCallback(
    (state: EditorState) => {
      commit(state)
      setSelectedId(null)
    },
    [commit]
  )

  const applyPreset = useCallback(
    (id: PresetId) => {
      const preset = createPreset(id)
      replaceDocument({ blocks: preset.blocks, theme: preset.theme })
    },
    [replaceDocument]
  )

  const startBlank = useCallback(() => {
    replaceDocument(createEmptyState(DEFAULT_THEME))
  }, [replaceDocument])

  const exportHtml = useCallback((): string | null => {
    const state = presentRef.current
    return state.blocks.length > 0 ? blocksToHtml(state.blocks, state.theme) : null
  }, [])

  const selectedBlock = useMemo<NewsletterBlock | null>(
    () => present.blocks.find((block) => block.id === selectedId) ?? null,
    [present.blocks, selectedId]
  )

  return {
    blocks: present.blocks,
    theme: present.theme,
    hydrated,
    saveStatus,
    selectedId,
    selectedBlock,
    setSelectedId,
    canUndo: historySize.past > 0,
    canRedo: historySize.future > 0,
    undo,
    redo,
    insertBlock,
    updateBlock,
    removeBlock,
    duplicateBlock,
    moveBlock,
    reorderBlocks,
    updateTheme,
    applyPreset,
    startBlank,
    replaceDocument,
    exportHtml,
  }
}

export type EditorDocumentApi = ReturnType<typeof useEditorDocument>
