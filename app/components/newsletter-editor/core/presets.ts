import { generateBlockId, type NewsletterBlock, type BlockType, type BlockData } from "./types"
import type { EmailTheme } from "./theme"

export type PresetId = "basic" | "security" | "code" | "product" | "renewal"

export const PRESET_LIST: { id: PresetId; name: string; detail: string }[] = [
  { id: "basic", name: "Simple letter", detail: "Logo, heading, paragraph, button, footer" },
  { id: "security", name: "Security alert", detail: "Accent bar, headline, sections" },
  { id: "code", name: "Sign-in code", detail: "Logo rule and a code box" },
  { id: "product", name: "Product update", detail: "Color field, banner, card" },
  { id: "renewal", name: "Renewal notice", detail: "Button and labeled details" },
]

function block(type: BlockType, data: BlockData): NewsletterBlock {
  return { id: generateBlockId(), type, data }
}

export function createPreset(id: PresetId): { theme: EmailTheme; blocks: NewsletterBlock[] } {
  switch (id) {
    case "basic":
      return basicPreset()
    case "security":
      return securityPreset()
    case "code":
      return codePreset()
    case "product":
      return productPreset()
    case "renewal":
      return renewalPreset()
  }
}

function basicPreset(): { theme: EmailTheme; blocks: NewsletterBlock[] } {
  return {
    theme: {
      pageBackground: "#f3f4f6",
      cardBackground: "#ffffff",
      cardRadius: 8,
      accentColor: "#111827",
      linkColor: "#2563eb",
      headingColor: "#111827",
      textColor: "#3f3f46",
      mutedColor: "#6b7280",
      font: "system",
      paddingX: 40,
      showAccentBar: false,
      align: "left",
    },
    blocks: [
      block("logo", {
        src: "",
        alt: "Your brand",
        alignment: "left",
        width: 120,
        showRule: false,
        ruleColor: "#111827",
      }),
      block("heading", {
        content: "A short headline that says what this email is about",
        level: 1,
        alignment: "left",
        color: "",
      }),
      block("text", {
        content: "Hi there,<br><br>Start with one or two sentences that explain why you are writing. Keep paragraphs short so they read well on a phone.",
        alignment: "left",
        size: "body",
        color: "",
      }),
      block("button", {
        label: "Take a look",
        url: "https://example.com",
        variant: "filled",
        color: "#111827",
        alignment: "left",
        borderRadius: "small",
      }),
      block("text", {
        content: "Thanks for reading,<br>The team",
        alignment: "left",
        size: "body",
        color: "",
      }),
      block("footer", {
        text: "You are receiving this email because you signed up on our website.",
        companyName: "Your Company, Inc.",
        address: "100 Market Street, San Francisco, CA 94105",
        unsubscribeUrl: "https://example.com/unsubscribe",
        backgroundColor: "#ffffff",
        textColor: "#9ca3af",
        alignment: "left",
      }),
    ],
  }
}

function securityPreset(): { theme: EmailTheme; blocks: NewsletterBlock[] } {
  return {
    theme: {
      pageBackground: "#eceff1",
      cardBackground: "#ffffff",
      cardRadius: 2,
      accentColor: "#f6821f",
      linkColor: "#f6821f",
      headingColor: "#1a1a1a",
      textColor: "#3c4043",
      mutedColor: "#6b7280",
      font: "system",
      paddingX: 40,
      showAccentBar: true,
      align: "left",
    },
    blocks: [
      block("logo", {
        src: "",
        alt: "Cloudline",
        alignment: "left",
        width: 120,
        showRule: false,
        ruleColor: "#f6821f",
      }),
      block("heading", {
        content: "A password associated with your account was compromised",
        level: 1,
        alignment: "left",
        color: "",
      }),
      block("button", {
        label: "Reset password",
        url: "https://example.com/reset",
        variant: "filled",
        color: "#f6821f",
        alignment: "left",
        borderRadius: "full",
      }),
      block("meta", {
        label: "Sign-in email",
        value: "you@company.com",
        valueUrl: "mailto:you@company.com",
        alignment: "left",
      }),
      block("heading", {
        content: "Was my account hacked?",
        level: 3,
        alignment: "left",
        color: "",
      }),
      block("text", {
        content:
          "No. We did not lose control of your credentials. We are writing so you can secure the account before someone else uses the password.",
        alignment: "left",
        size: "body",
        color: "",
      }),
      block("heading", {
        content: "How do you know my credentials were compromised?",
        level: 3,
        alignment: "left",
        color: "",
      }),
      block("text", {
        content:
          "We compare account passwords with breach research groups. When a password that matches yours shows up in a breach, we ask you to reset it.",
        alignment: "left",
        size: "body",
        color: "",
      }),
      block("text", {
        content:
          'Sites such as <a href="https://haveibeenpwned.com">Have I Been Pwned</a> can show which service leaked it.',
        alignment: "left",
        size: "body",
        color: "",
      }),
      block("heading", {
        content: "What else can I do to secure my account?",
        level: 3,
        alignment: "left",
        color: "",
      }),
      block("text", {
        content:
          "Turn on two-factor authentication if you have not already. If you reused this password anywhere else, reset those accounts too.",
        alignment: "left",
        size: "body",
        color: "",
      }),
      block("heading", {
        content: "Resources",
        level: 3,
        alignment: "left",
        color: "",
      }),
      block("list", {
        style: "bullet",
        markerColor: "#f6821f",
        alignment: "left",
        items: [
          { id: generateBlockId(), content: '<a href="https://example.com/2fa">Two-factor authentication</a>' },
          { id: generateBlockId(), content: '<a href="https://example.com/alerts">Leaked password notifications</a>' },
          { id: generateBlockId(), content: '<a href="https://example.com/safety">Keeping customers safe</a>' },
        ],
      }),
      block("heading", {
        content: "Why am I receiving this email?",
        level: 3,
        alignment: "left",
        color: "",
      }),
      block("text", {
        content: "A password saved on your account appeared in a breach on another service.",
        alignment: "left",
        size: "body",
        color: "",
      }),
      block("footer", {
        text: "Copyright © 2026 Cloudline, Inc.",
        companyName: "100 Market Street, San Francisco, CA 94105",
        address: "",
        unsubscribeUrl: "https://example.com/unsubscribe",
        backgroundColor: "#ffffff",
        textColor: "#9ca3af",
        alignment: "center",
      }),
      block("links", {
        alignment: "center",
        items: [
          { id: generateBlockId(), label: "cloudline.example", url: "https://example.com" },
          { id: generateBlockId(), label: "Community", url: "https://example.com/community" },
          { id: generateBlockId(), label: "Privacy", url: "https://example.com/privacy" },
        ],
      }),
      block("socials", {
        alignment: "center",
        iconSize: 16,
        iconColor: "#4b5563",
        links: [
          { platform: "facebook", url: "https://facebook.com", enabled: true },
          { platform: "twitter", url: "https://x.com", enabled: true },
          { platform: "instagram", url: "", enabled: false },
          { platform: "linkedin", url: "https://linkedin.com", enabled: true },
          { platform: "youtube", url: "", enabled: false },
          { platform: "website", url: "", enabled: false },
        ],
      }),
    ],
  }
}

function codePreset(): { theme: EmailTheme; blocks: NewsletterBlock[] } {
  return {
    theme: {
      pageBackground: "#f7f7f8",
      cardBackground: "#ffffff",
      cardRadius: 0,
      accentColor: "#f6821f",
      linkColor: "#2563eb",
      headingColor: "#111827",
      textColor: "#374151",
      mutedColor: "#6b7280",
      font: "system",
      paddingX: 40,
      showAccentBar: false,
      align: "left",
    },
    blocks: [
      block("logo", {
        src: "",
        alt: "Harbor",
        alignment: "left",
        width: 120,
        showRule: true,
        ruleColor: "#f6821f",
      }),
      block("text", {
        content: "Hello Alex Morgan,",
        alignment: "left",
        size: "large",
        color: "#111827",
      }),
      block("text", {
        content: "Use the code below to authenticate:",
        alignment: "left",
        size: "body",
        color: "",
      }),
      block("callout", {
        content: "708326",
        backgroundColor: "#e7f6ec",
        textColor: "#111827",
        alignment: "left",
        radius: 4,
        mono: false,
      }),
      block("text", {
        content: "This code is temporary and expires in 24 hours.",
        alignment: "left",
        size: "body",
        color: "",
      }),
      block("text", {
        content:
          "You are receiving it because a login was attempted from an unrecognized device. If this was not you, sign in and change your password.",
        alignment: "left",
        size: "body",
        color: "",
      }),
      block("text", {
        content: "Regards,<br>The Harbor Team",
        alignment: "left",
        size: "body",
        color: "",
      }),
      block("footer", {
        text: "Harbor Hosting Ltd. Registered in England and Wales.",
        companyName: "Company No. 09048802",
        address: "7th Floor, 50 Broadway, London SW1H 0DB",
        unsubscribeUrl: "https://example.com/unsubscribe",
        backgroundColor: "#ffffff",
        textColor: "#9ca3af",
        alignment: "left",
      }),
    ],
  }
}

function productPreset(): { theme: EmailTheme; blocks: NewsletterBlock[] } {
  return {
    theme: {
      pageBackground: "#ff8a1e",
      cardBackground: "#ffffff",
      cardRadius: 18,
      accentColor: "#f97316",
      linkColor: "#ea580c",
      headingColor: "#1c1917",
      textColor: "#44403c",
      mutedColor: "#78716c",
      font: "system",
      paddingX: 32,
      showAccentBar: false,
      align: "center",
    },
    blocks: [
      block("logo", {
        src: "",
        alt: "Beacon",
        alignment: "center",
        width: 120,
        showRule: false,
        ruleColor: "#f97316",
      }),
      block("heading", {
        content: "3 ways to keep remote config fetches lean",
        level: 1,
        alignment: "center",
        color: "",
      }),
      block("banner", {
        eyebrow: "Optimize fetch usage",
        title: "Ship config without the extra round trips",
        subtitle: "Three habits that keep apps fast and inside the plan.",
        backgroundColor: "#1c1917",
        titleColor: "#f5c542",
        subtitleColor: "#d6d3d1",
        showMark: true,
        markColor: "#f97316",
      }),
      block("text", {
        content:
          "Remote config moved to usage-based billing this month. These patterns keep startup fast and the bill predictable.",
        alignment: "center",
        size: "body",
        color: "",
      }),
      block("button", {
        label: "Learn more",
        url: "https://example.com/config",
        variant: "filled",
        color: "#f97316",
        alignment: "center",
        borderRadius: "full",
      }),
      block("card", {
        title: "Authentication, without the extra screens",
        body: "Build guest checkout and saved accounts in one flow, then drop the demo into your app.",
        buttonLabel: "Learn more",
        buttonUrl: "https://example.com/auth",
        buttonVariant: "outline",
        buttonColor: "#f97316",
        imageUrl: "",
        imageAlt: "Product illustration",
      }),
    ],
  }
}

function renewalPreset(): { theme: EmailTheme; blocks: NewsletterBlock[] } {
  return {
    theme: {
      pageBackground: "#f4f5f7",
      cardBackground: "#ffffff",
      cardRadius: 0,
      accentColor: "#3b6fd6",
      linkColor: "#2563eb",
      headingColor: "#111827",
      textColor: "#374151",
      mutedColor: "#6b7280",
      font: "system",
      paddingX: 40,
      showAccentBar: false,
      align: "left",
    },
    blocks: [
      block("logo", {
        src: "",
        alt: "Registry",
        alignment: "left",
        width: 120,
        showRule: false,
        ruleColor: "#3b6fd6",
      }),
      block("text", {
        content: "Hello!",
        alignment: "left",
        size: "large",
        color: "#111827",
      }),
      block("text", {
        content:
          'It has almost been a year since you registered <a href="https://example.com">studio.school</a>. Extending it takes a minute. Choose Renew and we will walk through payment.',
        alignment: "left",
        size: "body",
        color: "",
      }),
      block("button", {
        label: "Renew now",
        url: "https://example.com/renew",
        variant: "filled",
        color: "#3b6fd6",
        alignment: "center",
        borderRadius: "small",
      }),
      block("heading", {
        content: "Details",
        level: 3,
        alignment: "left",
        color: "",
      }),
      block("text", {
        content:
          "<strong>Your domain:</strong> studio.school &nbsp;&nbsp; <strong>Days left:</strong> 29<br><strong>Renewal date:</strong> October 13, 2026 &nbsp;&nbsp; <strong>Bundle:</strong> Campus &nbsp;&nbsp; <strong>Cost:</strong> $15.00",
        alignment: "left",
        size: "body",
        color: "",
      }),
      block("text", {
        content:
          "<strong>Bonus:</strong> After this renewal we will also reset the school email limit, so you can register a second domain for a year at no charge.",
        alignment: "left",
        size: "body",
        color: "",
      }),
      block("text", {
        content:
          "<strong>Note:</strong> If the domain is not renewed in the next 30 days, it returns to the public pool. The site, email, and anything attached to it will disconnect.",
        alignment: "left",
        size: "body",
        color: "",
      }),
      block("text", {
        content:
          "The renewal link expires 24 hours before the domain does. If you wait until the last day, contact support and we will process it manually.",
        alignment: "left",
        size: "body",
        color: "",
      }),
      block("text", {
        content: "Thank you for using Registry for Education.<br><br>Regards,<br>Registry for Education",
        alignment: "left",
        size: "body",
        color: "",
      }),
      block("text", {
        content:
          'If the button does not work, paste this link into your browser: <a href="https://example.com/renew">https://example.com/renew</a>',
        alignment: "left",
        size: "small",
        color: "",
      }),
      block("footer", {
        text: "© 2026 Registry for Education. All rights reserved.",
        companyName: "",
        address: "",
        unsubscribeUrl: "https://example.com/unsubscribe",
        backgroundColor: "#ffffff",
        textColor: "#9ca3af",
        alignment: "center",
      }),
    ],
  }
}
