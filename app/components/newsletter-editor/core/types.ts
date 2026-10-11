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
  | "logo"
  | "callout"
  | "list"
  | "meta"
  | "links"
  | "banner"
  | "card"

export type Align = "left" | "center" | "right"

export interface HeadingData {
  content: string
  level: 1 | 2 | 3
  alignment: Align
  color: string
}

export interface TextData {
  content: string
  alignment: Align
  size: "small" | "body" | "large"
  color: string
}

export interface ImageData {
  src: string
  alt: string
  width: "full" | "medium" | "small"
  alignment: Align
  linkUrl: string
  radius: 0 | 8 | 12
}

export interface ButtonData {
  label: string
  url: string
  variant: "filled" | "outline"
  color: string
  alignment: Align
  borderRadius: "none" | "small" | "full"
}

export interface DividerData {
  style: "solid" | "dashed" | "dotted"
  color: string
}

export interface SpacerData {
  height: 8 | 12 | 16 | 24 | 32 | 48 | 64
}

export interface ColumnsData {
  left: string
  right: string
  rightImage: string
  variant: "plain" | "card"
}

export interface HeaderData {
  title: string
  subtitle: string
  logoUrl: string
  logoWidth: number
  showDate: boolean
  backgroundColor: string
  textColor: string
  alignment: Align
}

export interface FooterData {
  text: string
  companyName: string
  address: string
  unsubscribeUrl: string
  backgroundColor: string
  textColor: string
  alignment: Align
}

export interface SocialLink {
  platform: "facebook" | "twitter" | "instagram" | "linkedin" | "youtube" | "website"
  url: string
  enabled: boolean
}

export interface SocialsData {
  links: SocialLink[]
  alignment: Align
  iconSize: 16 | 20 | 24 | 28
  iconColor: string
}

export interface LogoData {
  src: string
  alt: string
  alignment: Align
  width: number
  showRule: boolean
  ruleColor: string
}

export const LOGO_FORMATS = ["svg", "png", "jpg", "jpeg"] as const

export function logoSrcError(src: string): string | null {
  const value = src.trim()
  if (!value) return "Add an SVG, PNG, or JPG URL"
  if (value.startsWith("data:")) return "Hosted files only — SVG, PNG, or JPG"
  if (!/^https?:\/\//i.test(value)) return "Use an http or https image URL"
  const path = value.split("?")[0].split("#")[0]
  const ext = path.match(/\.([a-z0-9]+)$/i)?.[1]?.toLowerCase()
  if (ext && !LOGO_FORMATS.includes(ext as (typeof LOGO_FORMATS)[number])) {
    return "Use SVG, PNG, or JPG"
  }
  return null
}

export interface CalloutData {
  content: string
  backgroundColor: string
  textColor: string
  alignment: Align
  radius: number
  mono: boolean
}

export interface ListItem {
  id: string
  content: string
}

export interface ListData {
  items: ListItem[]
  style: "bullet" | "number"
  markerColor: string
  alignment: Align
}

export interface MetaData {
  label: string
  value: string
  valueUrl: string
  alignment: Align
}

export interface LinkItem {
  id: string
  label: string
  url: string
}

export interface LinksData {
  items: LinkItem[]
  alignment: Align
}

export interface BannerData {
  eyebrow: string
  title: string
  subtitle: string
  backgroundColor: string
  titleColor: string
  subtitleColor: string
  showMark: boolean
  markColor: string
}

export interface CardData {
  title: string
  body: string
  buttonLabel: string
  buttonUrl: string
  buttonVariant: "filled" | "outline"
  buttonColor: string
  imageUrl: string
  imageAlt: string
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
  | LogoData
  | CalloutData
  | ListData
  | MetaData
  | LinksData
  | BannerData
  | CardData

export interface NewsletterBlock {
  id: string
  type: BlockType
  data: BlockData
}

export interface BlockComponentProps<T extends BlockData = BlockData> {
  block: {
    id: string
    type: BlockType
    data: T
  }
  onUpdate: (data: Partial<T>, options?: { typing?: boolean }) => void
  isSelected: boolean
}

export type BlockUpdater<T extends BlockData = BlockData> = BlockComponentProps<T>["onUpdate"]

export const SPACER_HEIGHTS = [8, 12, 16, 24, 32, 48, 64] as const
export const SOCIAL_ICON_SIZES = [16, 20, 24, 28] as const
export const SOCIAL_PLATFORMS: SocialLink["platform"][] = ["facebook", "twitter", "instagram", "linkedin", "youtube", "website"]

export const BLOCK_TEMPLATES: Record<BlockType, () => BlockData> = {
  heading: () => ({
    content: "Your heading",
    level: 1 as const,
    alignment: "left" as const,
    color: "",
  }),
  text: () => ({
    content: "",
    alignment: "left" as const,
    size: "body" as const,
    color: "",
  }),
  image: () => ({
    src: "",
    alt: "",
    width: "full" as const,
    alignment: "left" as const,
    linkUrl: "",
    radius: 8 as const,
  }),
  button: () => ({
    label: "Continue",
    url: "",
    variant: "filled" as const,
    color: "#111827",
    alignment: "left" as const,
    borderRadius: "full" as const,
  }),
  divider: () => ({
    style: "solid" as const,
    color: "#e5e7eb",
  }),
  spacer: () => ({
    height: 12 as const,
  }),
  columns: () => ({
    left: "",
    right: "",
    rightImage: "",
    variant: "plain" as const,
  }),
  header: () => ({
    title: "Newsletter",
    subtitle: "",
    logoUrl: "",
    logoWidth: 120,
    showDate: false,
    backgroundColor: "#ffffff",
    textColor: "#111827",
    alignment: "left" as const,
  }),
  footer: () => ({
    text: "You received this email because you have an account with us.",
    companyName: "Your Company",
    address: "100 Market Street, San Francisco, CA 94105",
    unsubscribeUrl: "",
    backgroundColor: "#ffffff",
    textColor: "#9ca3af",
    alignment: "left" as const,
  }),
  socials: () => ({
    links: [
      { platform: "facebook", url: "https://facebook.com", enabled: true },
      { platform: "twitter", url: "https://x.com", enabled: true },
      { platform: "instagram", url: "https://instagram.com", enabled: false },
      { platform: "linkedin", url: "https://linkedin.com", enabled: true },
      { platform: "youtube", url: "https://youtube.com", enabled: false },
      { platform: "website", url: "https://example.com", enabled: false },
    ],
    alignment: "left" as const,
    iconSize: 16 as const,
    iconColor: "#4b5563",
  }),
  logo: () => ({
    src: "",
    alt: "Logo",
    alignment: "left" as const,
    width: 120,
    showRule: false,
    ruleColor: "#f6821f",
  }),
  callout: () => ({
    content: "482913",
    backgroundColor: "#e7f6ec",
    textColor: "#111827",
    alignment: "left" as const,
    radius: 6,
    mono: false,
  }),
  list: () => ({
    items: [
      { id: generateBlockId(), content: "First item" },
      { id: generateBlockId(), content: "Second item" },
    ],
    style: "bullet" as const,
    markerColor: "#f6821f",
    alignment: "left" as const,
  }),
  meta: () => ({
    label: "Account",
    value: "you@company.com",
    valueUrl: "",
    alignment: "left" as const,
  }),
  links: () => ({
    items: [
      { id: generateBlockId(), label: "Website", url: "https://example.com" },
      { id: generateBlockId(), label: "Help", url: "https://example.com/help" },
      { id: generateBlockId(), label: "Privacy", url: "https://example.com/privacy" },
    ],
    alignment: "left" as const,
  }),
  banner: () => ({
    eyebrow: "This month",
    title: "A clearer way to ship the update",
    subtitle: "Short context that sits under the title.",
    backgroundColor: "#1c1917",
    titleColor: "#f5c542",
    subtitleColor: "#e7e5e4",
    showMark: true,
    markColor: "#f97316",
  }),
  card: () => ({
    title: "A related story",
    body: "One or two lines that explain why this is worth opening.",
    buttonLabel: "Learn more",
    buttonUrl: "",
    buttonVariant: "outline" as const,
    buttonColor: "#f97316",
    imageUrl: "",
    imageAlt: "",
  }),
}

export type BlockCategory = "brand" | "content" | "media" | "layout" | "footer"

export const BLOCK_CATEGORIES: { id: BlockCategory; label: string }[] = [
  { id: "brand", label: "Brand" },
  { id: "content", label: "Content" },
  { id: "media", label: "Media" },
  { id: "layout", label: "Layout" },
  { id: "footer", label: "Footer" },
]

export const BLOCK_META: Record<BlockType, { label: string; description: string; category: BlockCategory }> = {
  logo: { label: "Logo", description: "SVG, PNG, or JPG mark", category: "brand" },
  header: { label: "Masthead", description: "Title, subtitle and date band", category: "brand" },
  heading: { label: "Heading", description: "Section title in three sizes", category: "content" },
  text: { label: "Text", description: "Paragraph with inline formatting", category: "content" },
  list: { label: "List", description: "Bulleted or numbered items", category: "content" },
  button: { label: "Button", description: "Call to action link", category: "content" },
  callout: { label: "Callout", description: "Highlighted note or code", category: "content" },
  meta: { label: "Meta", description: "Label and value pair", category: "content" },
  image: { label: "Image", description: "Full or partial width picture", category: "media" },
  banner: { label: "Banner", description: "Colored panel with headline", category: "media" },
  card: { label: "Card", description: "Story with image and button", category: "media" },
  columns: { label: "Columns", description: "Two side by side cells", category: "layout" },
  divider: { label: "Divider", description: "Horizontal rule", category: "layout" },
  spacer: { label: "Spacer", description: "Vertical breathing room", category: "layout" },
  links: { label: "Links", description: "Row of footer links", category: "footer" },
  socials: { label: "Socials", description: "Social network icons", category: "footer" },
  footer: { label: "Footer", description: "Legal text and unsubscribe", category: "footer" },
}

export const BLOCK_ORDER: BlockType[] = Object.keys(BLOCK_META) as BlockType[]

export function generateBlockId(): string {
  return `block_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}
