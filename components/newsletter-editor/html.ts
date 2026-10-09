import type {
  BannerData,
  ButtonData,
  CalloutData,
  CardData,
  ColumnsData,
  DividerData,
  FooterData,
  HeaderData,
  HeadingData,
  ImageData,
  LinksData,
  ListData,
  LogoData,
  MetaData,
  NewsletterBlock,
  SocialsData,
  SpacerData,
  TextData,
  BlockType,
} from "./types"
import { DEFAULT_THEME, FONT_STACKS, normalizeTheme, type EmailTheme } from "./theme"
import { stackSpace } from "./stack"

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function sanitizeRichHtml(html: string): string {
  if (!html) return ""
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/\son\w+=(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/javascript:/gi, "")
}

function paintLinks(html: string, color: string): string {
  return html.replace(/<a\b([^>]*)>/gi, (_match, attrs: string) => {
    if (/style\s*=/i.test(attrs)) return `<a${attrs}>`
    return `<a${attrs} style="color:${color};text-decoration:underline;">`
  })
}

function hostedSrc(src: string): string {
  if (!src) return ""
  if (src.startsWith("data:")) return ""
  return src
}

function fontOf(theme: EmailTheme): string {
  return FONT_STACKS[theme.font]
}

export function blocksToHtml(blocks: NewsletterBlock[], themeInput?: Partial<EmailTheme>): string {
  const theme = normalizeTheme({ ...DEFAULT_THEME, ...themeInput })
  const font = fontOf(theme)
  const body = blocks
    .map((block, index) => blockToHtml(block, theme, index > 0 ? blocks[index - 1].type : null))
    .join("\n")
  const accent = theme.showAccentBar
    ? `<tr><td style="height:4px;line-height:4px;font-size:0;background-color:${theme.accentColor};">&nbsp;</td></tr>`
    : ""

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  body { margin: 0; padding: 0; }
  table { border-spacing: 0; border-collapse: collapse; }
  img { border: 0; display: block; }
  a { color: ${theme.linkColor}; }
</style>
</head>
<body style="margin:0;padding:0;background-color:${theme.pageBackground};font-family:${font};color:${theme.textColor};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${theme.pageBackground};">
<tr><td align="center" style="padding:28px 16px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:${theme.cardBackground};border-radius:${theme.cardRadius}px;overflow:hidden;font-family:${font};">
${accent}
${body}
</table>
</td></tr>
</table>
</body>
</html>`
}

function cellStyle(theme: EmailTheme, type: BlockType, previous: BlockType | null, extra = ""): string {
  const space = stackSpace(type, previous)
  return `padding:${space.top}px ${theme.paddingX}px ${space.bottom}px;font-family:${fontOf(theme)};${extra}`
}

function blockToHtml(block: NewsletterBlock, theme: EmailTheme, previous: BlockType | null): string {
  const font = fontOf(theme)

  switch (block.type) {
    case "logo": {
      const d = block.data as LogoData
      const src = hostedSrc(d.src)
      const align = d.alignment || "left"
      const img = src
        ? `<img src="${escapeHtml(src)}" alt="${escapeHtml(d.alt || d.wordmark || "Logo")}" width="${d.width || 28}" style="width:${d.width || 28}px;height:auto;display:block;border:0;" />`
        : ""
      const word = d.wordmark
        ? `<span style="font-size:18px;font-weight:700;letter-spacing:-0.01em;line-height:1;color:${theme.headingColor};">${escapeHtml(d.wordmark)}</span>`
        : ""
      const suffix = d.suffix
        ? `<span style="font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:${theme.mutedColor};padding-left:8px;">${escapeHtml(d.suffix)}</span>`
        : ""
      const rule = d.showRule
        ? `<div style="height:2px;width:72px;background-color:${d.ruleColor || theme.accentColor};margin-top:12px;${align === "center" ? "margin-left:auto;margin-right:auto;" : align === "right" ? "margin-left:auto;" : ""}"></div>`
        : ""
      return `<tr><td style="${cellStyle(theme, "logo", previous, `text-align:${align};`)}">
<table role="presentation" cellpadding="0" cellspacing="0" style="${align === "center" ? "margin:0 auto;" : align === "right" ? "margin-left:auto;" : ""}">
<tr>
${img ? `<td style="vertical-align:middle;padding-right:${word ? "8px" : "0"};">${img}</td>` : ""}
<td style="vertical-align:middle;">${word}${suffix}</td>
</tr>
</table>
${rule}
</td></tr>`
    }
    case "heading": {
      const d = block.data as HeadingData
      const sizes: Record<number, string> = { 1: "28px", 2: "18px", 3: "15px" }
      const color = d.color || theme.headingColor
      const content = paintLinks(sanitizeRichHtml(d.content), theme.linkColor) || "Heading"
      return `<tr><td style="${cellStyle(theme, "heading", previous, `text-align:${d.alignment};`)}">
<h${d.level} style="margin:0;font-size:${sizes[d.level]};font-weight:700;line-height:${d.level === 1 ? "1.22" : "1.35"};letter-spacing:${d.level === 1 ? "-0.02em" : "-0.01em"};color:${color};">${content}</h${d.level}>
</td></tr>`
    }
    case "text": {
      const d = block.data as TextData
      const size = d.size || "body"
      const sizes = { small: "13px", body: "14px", large: "16px" }
      const color = d.color || (size === "small" ? theme.mutedColor : theme.textColor)
      const content = paintLinks(sanitizeRichHtml(d.content), theme.linkColor) || "&nbsp;"
      return `<tr><td style="${cellStyle(theme, "text", previous, `text-align:${d.alignment};font-size:${sizes[size]};line-height:1.55;color:${color};`)}">
<div style="margin:0;">${content}</div>
</td></tr>`
    }
    case "meta": {
      const d = block.data as MetaData
      const value = d.valueUrl
        ? `<a href="${escapeHtml(d.valueUrl)}" style="color:${theme.linkColor};text-decoration:none;">${escapeHtml(d.value)}</a>`
        : `<span style="color:${theme.linkColor};">${escapeHtml(d.value)}</span>`
      return `<tr><td style="${cellStyle(theme, "meta", previous, `text-align:${d.alignment};font-size:13px;line-height:1.4;color:${theme.mutedColor};`)}">
${escapeHtml(d.label)}${d.label ? ": " : ""}${value}
</td></tr>`
    }
    case "button": {
      const d = block.data as ButtonData
      const radius = d.borderRadius === "full" ? "999px" : d.borderRadius === "small" ? "6px" : "0"
      const bg = d.variant === "filled" ? d.color : "transparent"
      const textColor = d.variant === "filled" ? "#ffffff" : d.color
      const border = d.variant === "outline" ? `1px solid ${d.color}` : "none"
      return `<tr><td style="${cellStyle(theme, "button", previous, `text-align:${d.alignment};`)}">
<a href="${escapeHtml(d.url || "#")}" target="_blank" style="display:inline-block;padding:10px 18px;background-color:${bg};color:${textColor};border:${border};border-radius:${radius};text-decoration:none;font-size:14px;font-weight:600;line-height:1.2;font-family:${font};">${escapeHtml(d.label)}</a>
</td></tr>`
    }
    case "callout": {
      const d = block.data as CalloutData
      const content = paintLinks(sanitizeRichHtml(d.content), theme.linkColor) || "&nbsp;"
      const family = d.mono ? "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" : font
      return `<tr><td style="${cellStyle(theme, "callout", previous)}">
<div style="background-color:${d.backgroundColor};color:${d.textColor};border-radius:${d.radius || 6}px;padding:14px 16px;text-align:${d.alignment};font-size:15px;font-weight:500;line-height:1.45;font-family:${family};">${content}</div>
</td></tr>`
    }
    case "list": {
      const d = block.data as ListData
      const tag = d.style === "number" ? "ol" : "ul"
      const items = (d.items || [])
        .map((item) => {
          const content = paintLinks(sanitizeRichHtml(item.content), theme.linkColor) || "&nbsp;"
          return `<li style="margin:0 0 6px;font-size:14px;line-height:1.5;color:${theme.textColor};">${content}</li>`
        })
        .join("")
      const align = d.alignment || "left"
      return `<tr><td style="${cellStyle(theme, "list", previous, `text-align:${align};`)}">
<${tag} style="margin:0;padding:0 0 0 18px;list-style-type:${tag === "ol" ? "decimal" : "disc"};color:${d.markerColor || theme.linkColor};text-align:${align};">
${items}
</${tag}>
</td></tr>`
    }
    case "banner": {
      const d = block.data as BannerData
      const mark = d.showMark
        ? `<td width="72" valign="middle" style="padding:0 0 0 12px;"><div style="width:56px;height:56px;border-radius:28px;background-color:${d.markColor};font-size:0;line-height:56px;">&nbsp;</div></td>`
        : ""
      const eyebrow = d.eyebrow
        ? `<p style="margin:0 0 8px;font-size:13px;font-weight:600;line-height:1.3;color:${d.titleColor};">${escapeHtml(d.eyebrow)}</p>`
        : ""
      return `<tr><td style="${cellStyle(theme, "banner", previous)}">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${d.backgroundColor};border-radius:10px;">
<tr>
<td style="padding:26px 24px;vertical-align:middle;">
${eyebrow}
<p style="margin:0;font-size:22px;font-weight:700;line-height:1.25;letter-spacing:-0.02em;color:${d.titleColor};">${escapeHtml(d.title)}</p>
${d.subtitle ? `<p style="margin:8px 0 0;font-size:13px;line-height:1.45;color:${d.subtitleColor};">${escapeHtml(d.subtitle)}</p>` : ""}
</td>
${mark}
</tr>
</table>
</td></tr>`
    }
    case "card": {
      const d = block.data as CardData
      const src = hostedSrc(d.imageUrl)
      const radius = d.buttonVariant === "outline" ? "999px" : "999px"
      const bg = d.buttonVariant === "filled" ? d.buttonColor : "transparent"
      const textColor = d.buttonVariant === "filled" ? "#ffffff" : d.buttonColor
      const border = d.buttonVariant === "outline" ? `1px solid ${d.buttonColor}` : "none"
      const button = d.buttonLabel
        ? `<a href="${escapeHtml(d.buttonUrl || "#")}" style="display:inline-block;margin-top:14px;padding:8px 14px;background:${bg};color:${textColor};border:${border};border-radius:${radius};text-decoration:none;font-size:13px;font-weight:600;line-height:1.2;">${escapeHtml(d.buttonLabel)}</a>`
        : ""
      const media = src
        ? `<img src="${escapeHtml(src)}" alt="${escapeHtml(d.imageAlt || "")}" width="220" style="width:100%;max-width:220px;height:auto;border-radius:8px;display:block;" />`
        : `<div style="width:100%;height:108px;border-radius:8px;background-color:#f4f4f5;">&nbsp;</div>`
      const body = paintLinks(sanitizeRichHtml(d.body), theme.linkColor)
      return `<tr><td style="${cellStyle(theme, "card", previous)}">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e7e5e4;border-radius:12px;">
<tr>
<td width="58%" valign="top" style="padding:16px 8px 16px 16px;">
<p style="margin:0;font-size:15px;font-weight:700;line-height:1.35;color:${theme.headingColor};">${escapeHtml(d.title)}</p>
<div style="margin:6px 0 0;font-size:13px;line-height:1.5;color:${theme.textColor};">${body}</div>
${button}
</td>
<td width="42%" valign="middle" style="padding:12px 12px 12px 8px;">${media}</td>
</tr>
</table>
</td></tr>`
    }
    case "image": {
      const d = block.data as ImageData
      const src = hostedSrc(d.src)
      if (!src) return ""
      const widths: Record<string, string> = { full: "100%", medium: "72%", small: "42%" }
      const img = `<img src="${escapeHtml(src)}" alt="${escapeHtml(d.alt)}" width="536" style="width:${widths[d.width] || "100%"};max-width:100%;height:auto;display:block;border:0;border-radius:${d.radius || 0}px;${d.alignment === "center" ? "margin:0 auto;" : d.alignment === "right" ? "margin-left:auto;" : ""}" />`
      const wrapped = d.linkUrl ? `<a href="${escapeHtml(d.linkUrl)}" target="_blank">${img}</a>` : img
      return `<tr><td style="${cellStyle(theme, "image", previous, `text-align:${d.alignment};`)}">${wrapped}</td></tr>`
    }
    case "divider": {
      const d = block.data as DividerData
      return `<tr><td style="${cellStyle(theme, "divider", previous)}">
<div style="border-top:1px ${d.style} ${d.color};font-size:0;line-height:0;height:0;">&nbsp;</div>
</td></tr>`
    }
    case "spacer": {
      const d = block.data as SpacerData
      return `<tr><td style="height:${d.height}px;line-height:${d.height}px;font-size:0;">&nbsp;</td></tr>`
    }
    case "columns": {
      const d = block.data as ColumnsData
      const src = hostedSrc(d.rightImage || "")
      const right = src
        ? `<img src="${escapeHtml(src)}" alt="" width="240" style="width:100%;height:auto;display:block;border-radius:8px;" />`
        : `<div style="margin:0;font-size:14px;line-height:1.55;color:${theme.textColor};">${paintLinks(sanitizeRichHtml(d.right), theme.linkColor) || "&nbsp;"}</div>`
      const frame = d.variant === "card" ? "border:1px solid #e7e5e4;border-radius:12px;" : ""
      const inset = d.variant === "card" ? "12px" : "0"
      return `<tr><td style="${cellStyle(theme, "columns", previous)}">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="${frame}">
<tr>
<td width="50%" valign="top" style="padding:${inset};padding-right:10px;">
<div style="margin:0;font-size:14px;line-height:1.55;color:${theme.textColor};">${paintLinks(sanitizeRichHtml(d.left), theme.linkColor) || "&nbsp;"}</div>
</td>
<td width="50%" valign="top" style="padding:${inset};padding-left:10px;">
${right}
</td>
</tr>
</table>
</td></tr>`
    }
    case "header": {
      const d = block.data as HeaderData
      const align = d.alignment || "center"
      const src = hostedSrc(d.logoUrl)
      const logo = src
        ? `<img src="${escapeHtml(src)}" alt="Logo" width="${d.logoWidth || 80}" style="width:${d.logoWidth || 80}px;height:auto;display:${align === "center" ? "inline-block" : "block"};margin:0 0 8px;" />`
        : ""
      const dateString = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
      const dateTag = d.showDate
        ? `<p style="margin:8px 0 0;font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:${d.textColor};opacity:0.6;">${dateString}</p>`
        : ""
      return `<tr><td style="${cellStyle(theme, "header", previous, `background-color:${d.backgroundColor};text-align:${align};`)}">
${logo}
<p style="margin:0;font-size:20px;font-weight:700;line-height:1.25;letter-spacing:-0.02em;color:${d.textColor};">${escapeHtml(d.title)}</p>
${d.subtitle ? `<p style="margin:4px 0 0;font-size:13px;line-height:1.45;color:${d.textColor};opacity:0.75;">${escapeHtml(d.subtitle)}</p>` : ""}
${dateTag}
</td></tr>`
    }
    case "footer": {
      const d = block.data as FooterData
      const align = d.alignment || "center"
      return `<tr><td style="${cellStyle(theme, "footer", previous, `background-color:${d.backgroundColor};text-align:${align};font-size:12px;line-height:1.55;color:${d.textColor};`)}">
<p style="margin:0 0 4px;">${escapeHtml(d.text)}</p>
<p style="margin:0;">${escapeHtml(d.companyName)}</p>
<p style="margin:0 0 8px;">${escapeHtml(d.address)}</p>
<p style="margin:0;"><a href="${escapeHtml(d.unsubscribeUrl || "#")}" style="color:${d.textColor};text-decoration:underline;">Unsubscribe</a></p>
</td></tr>`
    }
    case "links": {
      const d = block.data as LinksData
      const parts = (d.items || [])
        .filter((item) => item.label)
        .map(
          (item) =>
            `<a href="${escapeHtml(item.url || "#")}" style="color:${theme.linkColor};text-decoration:none;font-size:12px;">${escapeHtml(item.label)}</a>`
        )
        .join(`<span style="color:#d4d4d8;padding:0 8px;">|</span>`)
      if (!parts) return ""
      return `<tr><td style="${cellStyle(theme, "links", previous, `text-align:${d.alignment};`)}">${parts}</td></tr>`
    }
    case "socials": {
      const d = block.data as SocialsData
      const active = d.links.filter((link) => link.enabled && link.url)
      if (active.length === 0) return ""
      const marks: Record<string, string> = {
        facebook: "f",
        twitter: "𝕏",
        instagram: "◎",
        linkedin: "in",
        youtube: "▶",
        website: "↗",
      }
      const cells = active
        .map(
          (link) => `<td style="padding:0 5px;">
<a href="${escapeHtml(link.url)}" style="display:inline-block;width:32px;height:32px;border-radius:16px;background-color:#ececec;color:${d.iconColor || "#4b5563"};text-decoration:none;text-align:center;line-height:32px;font-size:12px;font-weight:700;font-family:${font};">${marks[link.platform] || "•"}</a>
</td>`
        )
        .join("")
      const tableAlign = d.alignment === "center" ? "margin:0 auto;" : d.alignment === "right" ? "margin-left:auto;" : ""
      return `<tr><td style="${cellStyle(theme, "socials", previous, `text-align:${d.alignment};`)}">
<table role="presentation" cellpadding="0" cellspacing="0" style="${tableAlign}"><tr>${cells}</tr></table>
</td></tr>`
    }
    default:
      return ""
  }
}
