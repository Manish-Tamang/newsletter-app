import { blocksToHtml, type NewsletterBlock } from "@/components/newsletter-editor/types"

export const EMAIL_STORAGE_KEYS = {
  campaignBlocks: "newsletter_editor_blocks",
  templateBlocks: "template_editor_blocks",
  templateDraft: "template-editor-draft",
  campaignDraft: "campaign-editor-draft",
} as const

export function isValidEmailHtml(html: string | null | undefined): boolean {
  if (!html) return false
  const trimmed = html.trim()
  if (trimmed.length < 50) return false
  return true
}

export function stripInlineImageData(html: string): string {
  if (!html) return html
  return html
    .replace(/<img[^>]*src=["']data:[^>]*>/gi, "")
    .replace(/data:[^"')\s]+/gi, "")
}

export function getNewsletterBlocksHtml(storageKey: string = EMAIL_STORAGE_KEYS.campaignBlocks): string | null {
  if (typeof window === "undefined") return null
  const saved = localStorage.getItem(storageKey)
  if (!saved) return null
  try {
    const blocks = JSON.parse(saved) as NewsletterBlock[]
    if (Array.isArray(blocks) && blocks.length > 0) {
      const html = blocksToHtml(blocks)
      return isValidEmailHtml(html) ? html : null
    }
  } catch {
    return null
  }
  return null
}

export function resolveEmailHtml(options: {
  content: string
  rawHtml: string
  useRawHtml: boolean
  blocksStorageKey?: string
}): string {
  const { content, rawHtml, useRawHtml, blocksStorageKey = EMAIL_STORAGE_KEYS.campaignBlocks } = options

  if (useRawHtml) {
    const raw = rawHtml.trim()
    if (isValidEmailHtml(raw)) return stripInlineImageData(raw)
    return stripInlineImageData(content.trim())
  }

  const fromState = content.trim()
  if (isValidEmailHtml(fromState)) return stripInlineImageData(fromState)

  return stripInlineImageData(getNewsletterBlocksHtml(blocksStorageKey) || "")
}

export function saveDraftToStorage(
  storageKey: string,
  data: Record<string, unknown>
): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(
      storageKey,
      JSON.stringify({ ...data, savedAt: new Date().toISOString() })
    )
  } catch (error) {
    console.error("Failed to save draft:", error)
  }
}

export function loadDraftFromStorage<T extends Record<string, unknown>>(
  storageKey: string
): T | null {
  if (typeof window === "undefined") return null
  try {
    const saved = localStorage.getItem(storageKey)
    if (!saved) return null
    return JSON.parse(saved) as T
  } catch {
    return null
  }
}
