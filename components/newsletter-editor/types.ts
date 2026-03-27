export type BlockType =
  | "heading"
  | "text"
  | "image"
  | "button"
  | "divider"
  | "spacer"
  | "columns"
  | "header"
  | "footer"
  | "socials"

export interface HeadingData {
  content: string
  level: 1 | 2 | 3
  alignment: "left" | "center" | "right"
}

export interface TextData {
  content: string
  alignment: "left" | "center" | "right"
}

export interface ImageData {
  src: string
  alt: string
  width: "full" | "medium" | "small"
  alignment: "left" | "center" | "right"
  linkUrl: string
}

export interface ButtonData {
  label: string
  url: string
  variant: "filled" | "outline"
  color: string
  alignment: "left" | "center" | "right"
  borderRadius: "none" | "small" | "full"
}

export interface DividerData {
  style: "solid" | "dashed" | "dotted"
  color: string
}

export interface SpacerData {
  height: 16 | 32 | 48 | 64
}

export interface ColumnsData {
  left: string
  right: string
}

export interface HeaderData {
  title: string
  subtitle: string
  logoUrl: string
  logoWidth: number
  showDate: boolean
  backgroundColor: string
  textColor: string
}

export interface FooterData {
  text: string
  companyName: string
  address: string
  unsubscribeUrl: string
  backgroundColor: string
  textColor: string
}

export interface SocialLink {
  platform: "facebook" | "twitter" | "instagram" | "linkedin" | "youtube" | "website"
  url: string
  enabled: boolean
}

export interface SocialsData {
  links: SocialLink[]
  alignment: "left" | "center" | "right"
  iconSize: 20 | 24 | 28
  iconColor: string
}

export type BlockData =
  | HeadingData
  | TextData
  | ImageData
  | ButtonData
  | DividerData
  | SpacerData
  | ColumnsData
  | HeaderData
  | FooterData
  | SocialsData

export interface NewsletterBlock {
  id: string
  type: BlockType
  data: BlockData
}

export interface BlockComponentProps<T extends BlockData = BlockData> {
  block: NewsletterBlock & { data: T }
  onUpdate: (data: Partial<T>) => void
  isSelected: boolean
  onSelect: () => void
}

export const BLOCK_TEMPLATES: Record<BlockType, () => BlockData> = {
  heading: () => ({
    content: "Your Heading",
    level: 1 as const,
    alignment: "left" as const,
  }),
  text: () => ({
    content: "",
    alignment: "left" as const,
  }),
  image: () => ({
    src: "",
    alt: "",
    width: "full" as const,
    alignment: "center" as const,
    linkUrl: "",
  }),
  button: () => ({
    label: "Click Here",
    url: "",
    variant: "filled" as const,
    color: "#18181b",
    alignment: "center" as const,
    borderRadius: "small" as const,
  }),
  divider: () => ({
    style: "solid" as const,
    color: "#e5e7eb",
  }),
  spacer: () => ({
    height: 32 as const,
  }),
  columns: () => ({
    left: "",
    right: "",
  }),
  header: () => ({
    title: "NEWSLETTER TITLE",
    subtitle: "Weekly updates and insights",
    logoUrl: "",
    logoWidth: 80,
    showDate: true,
    backgroundColor: "#ffffff",
    textColor: "#18181b",
  }),
  footer: () => ({
    text: "You are receiving this email because you opted in on our website.",
    companyName: "Your Company Inc.",
    address: "123 Main St, San Francisco, CA 94105",
    unsubscribeUrl: "",
    backgroundColor: "#f4f4f5",
    textColor: "#71717a",
  }),
  socials: () => ({
    links: [
      { platform: "facebook", url: "https://facebook.com", enabled: true },
      { platform: "twitter", url: "https://twitter.com", enabled: true },
      { platform: "instagram", url: "https://instagram.com", enabled: true },
      { platform: "linkedin", url: "https://linkedin.com", enabled: false },
      { platform: "youtube", url: "https://youtube.com", enabled: false },
      { platform: "website", url: "https://example.com", enabled: false },
    ],
    alignment: "center" as const,
    iconSize: 24 as const,
    iconColor: "#71717a",
  }),
}

export const BLOCK_META: Record<BlockType, { label: string; icon: string }> = {
  heading: { label: "Heading", icon: "Heading" },
  text: { label: "Text", icon: "Type" },
  image: { label: "Image", icon: "ImageIcon" },
  button: { label: "Button", icon: "MousePointerClick" },
  divider: { label: "Divider", icon: "Minus" },
  spacer: { label: "Spacer", icon: "MoveVertical" },
  columns: { label: "Columns", icon: "Columns2" },
  header: { label: "Header", icon: "LayoutHeader" },
  footer: { label: "Footer", icon: "LayoutFooter" },
  socials: { label: "Socials", icon: "Share2" },
}

export function generateBlockId(): string {
  return `block_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

export function blocksToHtml(blocks: NewsletterBlock[]): string {
  const bodyContent = blocks.map(blockToHtml).join("\n")

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
  table { border-spacing: 0; border-collapse: collapse; }
  td { padding: 0; }
  img { border: 0; display: block; }
</style>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:8px;overflow:hidden;">
${bodyContent}
</table>
</td></tr>
</table>
</body>
</html>`
}

function stripHeavyContent(html: string): string {
  if (!html) return html
  return html
    .replace(/<img[^>]*>/gi, "")
    .replace(/data:[^"')\s]+/gi, "")
}

function blockToHtml(block: NewsletterBlock): string {
  switch (block.type) {
    case "heading": {
      const d = block.data as HeadingData
      const sizes: Record<number, string> = { 1: "28px", 2: "22px", 3: "18px" }
      const weights: Record<number, string> = { 1: "700", 2: "600", 3: "600" }
      return `<tr><td style="padding:24px 32px 8px 32px;text-align:${d.alignment};">
<h${d.level} style="margin:0;font-size:${sizes[d.level]};font-weight:${weights[d.level]};line-height:1.3;color:#18181b;">${stripHeavyContent(d.content)}</h${d.level}>
</td></tr>`
    }
    case "text": {
      const d = block.data as TextData
      return `<tr><td style="padding:8px 32px;text-align:${d.alignment};">
<p style="margin:0;font-size:16px;line-height:1.6;color:#3f3f46;">${stripHeavyContent(d.content) || "&nbsp;"}</p>
</td></tr>`
    }
    case "image": {
      // Image output disabled for now: base64 data URLs bloat the email and get
      // clipped by mail clients. Render nothing until hosted-image logic is added.
      return ""
      // const d = block.data as ImageData
      // if (!d.src) return ""
      // const widths: Record<string, string> = { full: "100%", medium: "70%", small: "40%" }
      // const imgTag = `<img src="${d.src}" alt="${d.alt}" style="width:${widths[d.width]};max-width:100%;height:auto;display:block;${d.alignment === "center" ? "margin:0 auto;" : ""}" />`
      // const wrapped = d.linkUrl ? `<a href="${d.linkUrl}" target="_blank">${imgTag}</a>` : imgTag
      // return `<tr><td style="padding:16px 32px;text-align:${d.alignment};">${wrapped}</td></tr>`
    }
    case "button": {
      const d = block.data as ButtonData
      const radius = d.borderRadius === "full" ? "50px" : d.borderRadius === "small" ? "6px" : "0"
      const bg = d.variant === "filled" ? d.color : "transparent"
      const textColor = d.variant === "filled" ? "#ffffff" : d.color
      const border = d.variant === "outline" ? `2px solid ${d.color}` : "none"
      return `<tr><td style="padding:16px 32px;text-align:${d.alignment};">
<a href="${d.url || "#"}" target="_blank" style="display:inline-block;padding:12px 28px;background-color:${bg};color:${textColor};border:${border};border-radius:${radius};text-decoration:none;font-size:15px;font-weight:600;line-height:1;">${d.label}</a>
</td></tr>`
    }
    case "divider": {
      const d = block.data as DividerData
      return `<tr><td style="padding:16px 32px;">
<hr style="margin:0;border:none;border-top:1px ${d.style} ${d.color};" />
</td></tr>`
    }
    case "spacer": {
      const d = block.data as SpacerData
      return `<tr><td style="height:${d.height}px;line-height:${d.height}px;">&nbsp;</td></tr>`
    }
    case "columns": {
      const d = block.data as ColumnsData
      return `<tr><td style="padding:8px 32px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr>
<td width="48%" style="vertical-align:top;padding-right:16px;">
<p style="margin:0;font-size:16px;line-height:1.6;color:#3f3f46;">${stripHeavyContent(d.left) || "&nbsp;"}</p>
</td>
<td width="4%"></td>
<td width="48%" style="vertical-align:top;padding-left:16px;">
<p style="margin:0;font-size:16px;line-height:1.6;color:#3f3f46;">${stripHeavyContent(d.right) || "&nbsp;"}</p>
</td>
</tr>
</table>
</td></tr>`
    }
    case "header": {
      const d = block.data as HeaderData
      const logoTag = d.logoUrl
        ? `<img src="${d.logoUrl}" alt="Logo" width="${d.logoWidth}" style="width:${d.logoWidth}px;max-width:100%;height:auto;margin-bottom:16px;display:inline-block;" />`
        : ""
      const dateString = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
      const dateTag = d.showDate
        ? `<p style="margin:12px 0 0 0;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;color:${d.textColor};opacity:0.6;">${dateString}</p>`
        : ""
      return `<tr><td style="padding:40px 32px;background-color:${d.backgroundColor};text-align:center;border-bottom:1px solid #e5e7eb;">
${logoTag}
<h1 style="margin:0;font-size:28px;font-weight:800;line-height:1.2;color:${d.textColor};">${d.title}</h1>
${d.subtitle ? `<p style="margin:8px 0 0 0;font-size:15px;color:${d.textColor};opacity:0.8;">${d.subtitle}</p>` : ""}
${dateTag}
</td></tr>`
    }
    case "footer": {
      const d = block.data as FooterData
      return `<tr><td style="padding:32px;background-color:${d.backgroundColor};text-align:center;font-size:12px;line-height:1.6;color:${d.textColor};">
<p style="margin:0 0 8px 0;opacity:0.8;">${d.text}</p>
<p style="margin:0 0 4px 0;font-weight:600;opacity:0.9;">${d.companyName}</p>
<p style="margin:0 0 16px 0;opacity:0.7;">${d.address}</p>
<p style="margin:0;"><a href="${d.unsubscribeUrl || "#"}" target="_blank" style="color:${d.textColor};text-decoration:underline;font-weight:600;opacity:0.9;">Unsubscribe</a></p>
</td></tr>`
    }
    case "socials": {
      const d = block.data as SocialsData
      const activeLinks = d.links.filter((l) => l.enabled && l.url)
      if (activeLinks.length === 0) return ""

      const cdnIcons: Record<string, string> = {
        facebook: "https://cdn-icons-png.flaticon.com/512/733/733547.png",
        twitter: "https://cdn-icons-png.flaticon.com/512/733/733579.png",
        instagram: "https://cdn-icons-png.flaticon.com/512/2111/2111463.png",
        linkedin: "https://cdn-icons-png.flaticon.com/512/174/174857.png",
        youtube: "https://cdn-icons-png.flaticon.com/512/1384/1384060.png",
        website: "https://cdn-icons-png.flaticon.com/512/1006/1006771.png",
      }

      const linksHtml = activeLinks
        .map((l) => {
          const iconSrc = cdnIcons[l.platform]
          return `<td style="padding:0 8px;display:inline-block;">
<a href="${l.url}" target="_blank" style="text-decoration:none;">
<img src="${iconSrc}" alt="${l.platform}" width="${d.iconSize}" height="${d.iconSize}" style="display:block;width:${d.iconSize}px;height:${d.iconSize}px;border:0;${d.iconColor ? `filter: grayscale(1);` : ""}" />
</a>
</td>`
        })
        .join("")

      return `<tr><td style="padding:24px 32px;text-align:${d.alignment};">
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:${d.alignment === "center" ? "0 auto" : d.alignment === "right" ? "0 0 0 auto" : "0 auto 0 0"};display:inline-block;">
<tr>
${linksHtml}
</tr>
</table>
</td></tr>`
    }
    default:
      return ""
  }
}
