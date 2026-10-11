import type { Align, BlockData, BlockType, NewsletterBlock } from "./types"
import type { EmailTheme } from "./theme"

export function stackSpace(type: BlockType, previous: BlockType | null): { top: number; bottom: number } {
  if (type === "spacer") return { top: 0, bottom: 0 }
  if (!previous) {
    if (type === "logo" || type === "header") return { top: 24, bottom: 2 }
    if (type === "heading") return { top: 20, bottom: 0 }
    return { top: 18, bottom: 2 }
  }
  if (type === "heading" && previous === "logo") return { top: 12, bottom: 0 }
  if (type === "heading" && (previous === "text" || previous === "list" || previous === "button" || previous === "callout" || previous === "meta")) {
    return { top: 16, bottom: 0 }
  }
  if ((type === "text" || type === "meta" || type === "list") && (previous === "heading" || previous === "logo" || previous === "header")) {
    return { top: 6, bottom: 0 }
  }
  if (type === "text" && (previous === "text" || previous === "meta" || previous === "list" || previous === "callout")) {
    return { top: 8, bottom: 0 }
  }
  if (type === "list" && previous === "heading") return { top: 4, bottom: 0 }
  if (type === "button" && (previous === "heading" || previous === "text" || previous === "list")) {
    return { top: 10, bottom: 2 }
  }
  if (type === "meta" && previous === "button") return { top: 8, bottom: 2 }
  if ((type === "links" || type === "socials") && (previous === "footer" || previous === "links")) {
    return { top: 4, bottom: 2 }
  }
  if (type === "footer" || type === "links" || type === "socials") return { top: 16, bottom: 2 }
  if (type === "divider") return { top: 10, bottom: 6 }
  return { top: 10, bottom: 2 }
}

export function inferAlign(blocks: NewsletterBlock[]): Align {
  const counts: Record<Align, number> = { left: 0, center: 0, right: 0 }
  for (const block of blocks) {
    if (hasAlignment(block.data)) counts[block.data.alignment] += 1
  }
  if (counts.center > counts.left && counts.center >= counts.right) return "center"
  if (counts.right > counts.left && counts.right > counts.center) return "right"
  return "left"
}

export function hasAlignment(data: BlockData): data is BlockData & { alignment: Align } {
  return typeof data === "object" && data !== null && "alignment" in data
}

export function alignBlock(block: NewsletterBlock, alignment: Align): NewsletterBlock {
  if (!hasAlignment(block.data)) return block
  return { ...block, data: { ...block.data, alignment } as BlockData }
}

export function withThemeDefaults(type: BlockType, data: BlockData, theme: EmailTheme): BlockData {
  const next = (hasAlignment(data) ? { ...data, alignment: theme.align } : data) as BlockData
  if (type === "button" && "color" in next) {
    return { ...next, color: theme.accentColor } as BlockData
  }
  if (type === "list" && "markerColor" in next) {
    return { ...next, markerColor: theme.linkColor } as BlockData
  }
  if (type === "logo" && "ruleColor" in next) {
    return { ...next, ruleColor: theme.accentColor } as BlockData
  }
  return next
}
