import type { Align, NewsletterBlock } from "./types"

export type EmailFont = "system" | "inter" | "arial" | "georgia"

export interface EmailTheme {
  pageBackground: string
  cardBackground: string
  cardRadius: number
  accentColor: string
  linkColor: string
  headingColor: string
  textColor: string
  mutedColor: string
  font: EmailFont
  paddingX: number
  showAccentBar: boolean
  align: Align
}

export const FONT_STACKS: Record<EmailFont, string> = {
  system: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  inter: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  arial: "Arial, Helvetica, sans-serif",
  georgia: "Georgia, 'Times New Roman', Times, serif",
}

export const FONT_OPTIONS: { id: EmailFont; label: string }[] = [
  { id: "system", label: "System" },
  { id: "inter", label: "Inter" },
  { id: "arial", label: "Arial" },
  { id: "georgia", label: "Georgia" },
]

export const DEFAULT_THEME: EmailTheme = {
  pageBackground: "#f3f4f6",
  cardBackground: "#ffffff",
  cardRadius: 4,
  accentColor: "#f6821f",
  linkColor: "#f6821f",
  headingColor: "#111827",
  textColor: "#3f3f46",
  mutedColor: "#6b7280",
  font: "system",
  paddingX: 40,
  showAccentBar: false,
  align: "left",
}

export function normalizeTheme(input?: Partial<EmailTheme> | null): EmailTheme {
  if (!input) return { ...DEFAULT_THEME }
  return { ...DEFAULT_THEME, ...input }
}

export interface EditorDocument {
  version: 2
  theme: EmailTheme
  blocks: NewsletterBlock[]
}

export function parseEditorDocument(raw: string): EditorDocument | null {
  try {
    const parsed = JSON.parse(raw) as unknown
    if (Array.isArray(parsed)) {
      return { version: 2, theme: { ...DEFAULT_THEME }, blocks: parsed as NewsletterBlock[] }
    }
    if (parsed && typeof parsed === "object" && Array.isArray((parsed as { blocks?: unknown }).blocks)) {
      const doc = parsed as { theme?: Partial<EmailTheme>; blocks: NewsletterBlock[] }
      return { version: 2, theme: normalizeTheme(doc.theme), blocks: doc.blocks }
    }
  } catch {
    return null
  }
  return null
}
