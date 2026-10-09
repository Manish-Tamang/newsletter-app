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
  wordmark: string
  suffix: string
  alignment: Align
  width: number
  showRule: boolean
  ruleColor: string
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
  onUpdate: (data: Partial<T>) => void
  isSelected: boolean
  onSelect: () => void
}

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
    wordmark: "ACME",
    suffix: "",
    alignment: "left" as const,
    width: 28,
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

export const BLOCK_META: Record<BlockType, { label: string; icon: string }> = {
  heading: { label: "Heading", icon: "Heading" },
  text: { label: "Text", icon: "Type" },
  image: { label: "Image", icon: "ImageIcon" },
  button: { label: "Button", icon: "MousePointerClick" },
  divider: { label: "Divider", icon: "Minus" },
  spacer: { label: "Spacer", icon: "MoveVertical" },
  columns: { label: "Columns", icon: "Columns2" },
  header: { label: "Masthead", icon: "LayoutHeader" },
  footer: { label: "Footer", icon: "LayoutFooter" },
  socials: { label: "Socials", icon: "Share2" },
  logo: { label: "Logo", icon: "Hexagon" },
  callout: { label: "Callout", icon: "Square" },
  list: { label: "List", icon: "List" },
  meta: { label: "Meta", icon: "AtSign" },
  links: { label: "Links", icon: "Link2" },
  banner: { label: "Banner", icon: "RectangleHorizontal" },
  card: { label: "Card", icon: "GalleryHorizontal" },
}

export function generateBlockId(): string {
  return `block_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}
