"use client"

import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube, FaGlobe } from "react-icons/fa"
import type { BlockComponentProps, SocialsData } from "../types"
import { BlockSettings } from "../BlockSettings"
import { AlignPills, ColorField } from "../settings-controls"

const PLATFORM_ICONS: Record<string, React.ComponentType<{ size?: number; style?: React.CSSProperties }>> = {
  facebook: FaFacebook,
  twitter: FaTwitter,
  instagram: FaInstagram,
  linkedin: FaLinkedin,
  youtube: FaYoutube,
  website: FaGlobe,
}

const PLATFORM_LABELS: Record<string, string> = {
  facebook: "Facebook",
  twitter: "X / Twitter",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  youtube: "YouTube",
  website: "Website",
}

export function SocialsBlock({ block, onUpdate, isSelected, onSelect }: BlockComponentProps<SocialsData>) {
  const activeLinks = block.data.links.filter((l) => l.enabled)

  const handleLinkChange = (platform: string, enabled: boolean, url: string) => {
    const updatedLinks = block.data.links.map((link) =>
      link.platform === platform ? { ...link, enabled, url } : link
    )
    onUpdate({ links: updatedLinks })
  }

  return (
    <div onClick={onSelect}>
      <div className="nl-socials-block" style={{ textAlign: block.data.alignment }}>
        {activeLinks.length === 0 ? (
          <div style={{ fontSize: "12px", color: "#9ca3af", fontStyle: "italic", textAlign: "center" }}>
            Add socials links in settings below
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent:
                block.data.alignment === "center"
                  ? "center"
                  : block.data.alignment === "right"
                  ? "flex-end"
                  : "flex-start",
              gap: "12px",
              alignItems: "center",
            }}
          >
            {activeLinks.map((link) => {
              const IconComponent = PLATFORM_ICONS[link.platform]
              if (!IconComponent) return null

              return (
                <a
                  key={link.platform}
                  href={link.url || "#"}
                  onClick={(e) => {
                    if (!link.url) e.preventDefault()
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nl-social-bubble"
                  style={{ color: block.data.iconColor || "#4b5563" }}
                >
                  <IconComponent size={block.data.iconSize} />
                </a>
              )
            })}
          </div>
        )}
      </div>

      <BlockSettings active={isSelected}>
        <div className="nl-block-settings">
          <div className="nl-block-settings-row">
            <AlignPills value={block.data.alignment} onChange={(alignment) => onUpdate({ alignment })} />
            <span className="nl-settings-label">Size</span>
            <div className="nl-pill-group">
              {([16, 20, 24] as const).map((sz) => (
                <button
                  key={sz}
                  type="button"
                  className={`nl-pill ${block.data.iconSize === sz ? "nl-pill-active" : ""}`}
                  onClick={() => onUpdate({ iconSize: sz })}
                >
                  {sz === 16 ? "Small" : sz === 20 ? "Medium" : "Large"}
                </button>
              ))}
            </div>
            <ColorField
              label="Color"
              value={block.data.iconColor || "#4b5563"}
              onChange={(iconColor) => onUpdate({ iconColor })}
            />
          </div>

          <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
            <span style={{ fontSize: "11px", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase" }}>Platforms</span>
            {block.data.links.map((link) => {
              const IconComponent = PLATFORM_ICONS[link.platform]
              return (
                <div
                  key={link.platform}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "6px 8px",
                    border: "1px solid #f4f4f5",
                    borderRadius: "6px",
                    background: "#fafafa",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={link.enabled}
                    onChange={(e) => handleLinkChange(link.platform, e.target.checked, link.url)}
                    style={{ cursor: "pointer" }}
                  />
                  {IconComponent && <IconComponent size={16} style={{ color: "#71717a" }} />}
                  <span style={{ fontSize: "12px", minWidth: "90px", fontWeight: 500 }}>
                    {PLATFORM_LABELS[link.platform]}
                  </span>
                  <input
                    className="nl-settings-input"
                    style={{ height: "28px" }}
                    disabled={!link.enabled}
                    value={link.url}
                    onChange={(e) => handleLinkChange(link.platform, link.enabled, e.target.value)}
                    placeholder={`https://${link.platform}.com/username`}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </BlockSettings>
    </div>
  )
}
