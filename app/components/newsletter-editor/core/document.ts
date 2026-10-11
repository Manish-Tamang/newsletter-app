import {
  BLOCK_TEMPLATES,
  generateBlockId,
  type Align,
  type BlockData,
  type BlockType,
  type NewsletterBlock,
} from "./types"
import { DEFAULT_THEME, type EmailTheme } from "./theme"
import { alignBlock, withThemeDefaults } from "./stack"

export interface EditorState {
  blocks: NewsletterBlock[]
  theme: EmailTheme
}

export function createEmptyState(theme: EmailTheme = DEFAULT_THEME): EditorState {
  return { blocks: [], theme: { ...theme } }
}

export function createBlock(type: BlockType, theme: EmailTheme): NewsletterBlock {
  return {
    id: generateBlockId(),
    type,
    data: withThemeDefaults(type, BLOCK_TEMPLATES[type](), theme),
  }
}

export function insertBlock(state: EditorState, type: BlockType, index?: number): { state: EditorState; block: NewsletterBlock } {
  const block = createBlock(type, state.theme)
  const at = index === undefined ? state.blocks.length : Math.max(0, Math.min(index, state.blocks.length))
  const blocks = [...state.blocks.slice(0, at), block, ...state.blocks.slice(at)]
  return { state: { ...state, blocks }, block }
}

export function updateBlockData(state: EditorState, id: string, patch: Partial<BlockData>): EditorState {
  let changed = false
  const blocks = state.blocks.map((block) => {
    if (block.id !== id) return block
    changed = true
    return { ...block, data: { ...block.data, ...patch } as BlockData }
  })
  return changed ? { ...state, blocks } : state
}

export function removeBlock(state: EditorState, id: string): EditorState {
  const blocks = state.blocks.filter((block) => block.id !== id)
  return blocks.length === state.blocks.length ? state : { ...state, blocks }
}

export function duplicateBlock(state: EditorState, id: string): { state: EditorState; block: NewsletterBlock | null } {
  const index = state.blocks.findIndex((block) => block.id === id)
  if (index === -1) return { state, block: null }
  const source = state.blocks[index]
  const clone: NewsletterBlock = {
    ...source,
    id: generateBlockId(),
    data: cloneData(source.data),
  }
  const blocks = [...state.blocks.slice(0, index + 1), clone, ...state.blocks.slice(index + 1)]
  return { state: { ...state, blocks }, block: clone }
}

export function moveBlock(state: EditorState, id: string, direction: "up" | "down"): EditorState {
  const index = state.blocks.findIndex((block) => block.id === id)
  if (index === -1) return state
  const target = direction === "up" ? index - 1 : index + 1
  if (target < 0 || target >= state.blocks.length) return state
  return reorderBlocks(state, index, target)
}

export function reorderBlocks(state: EditorState, from: number, to: number): EditorState {
  if (from === to || from < 0 || to < 0 || from >= state.blocks.length || to >= state.blocks.length) return state
  const blocks = [...state.blocks]
  const [moved] = blocks.splice(from, 1)
  blocks.splice(to, 0, moved)
  return { ...state, blocks }
}

export function updateTheme(state: EditorState, patch: Partial<EmailTheme>): EditorState {
  const theme = { ...state.theme, ...patch }
  let blocks = state.blocks
  if (patch.align && patch.align !== state.theme.align) {
    blocks = blocks.map((block) => alignBlock(block, patch.align as Align))
  }
  return { blocks, theme }
}

export function blockAlignment(block: NewsletterBlock | null): Align | null {
  if (!block) return null
  const data = block.data as { alignment?: Align }
  return data.alignment ?? null
}

function cloneData(data: BlockData): BlockData {
  const copy = { ...data } as Record<string, unknown>
  if (Array.isArray(copy.items)) {
    copy.items = (copy.items as { id: string }[]).map((item) => ({ ...item, id: generateBlockId() }))
  }
  if (Array.isArray(copy.links)) {
    copy.links = (copy.links as object[]).map((link) => ({ ...link }))
  }
  return copy as unknown as BlockData
}
