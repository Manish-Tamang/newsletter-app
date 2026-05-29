"use client"

import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube, FaGlobe } from "react-icons/fa"
import type { BlockComponentProps, SocialsData, SocialLink } from "../types"

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
      <div
        className="nl-socials-block"
        style={{
          padding: "20px 32px",
          textAlign: block.data.alignment,
        }}
      >
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
                  style={{
                    color: block.data.iconColor || "#71717a",
                    transition: "opacity 0.15s ease",
                    display: "inline-block",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  <IconComponent size={block.data.iconSize} />
                </a>
              )
            })}
          </div>
        )}
      </div>

      {isSelected && (
        <div className="nl-block-settings">
          <div className="nl-block-settings-row">
            <span className="nl-settings-label">Alignment</span>
            <div className="nl-pill-group">
              {(["left", "center", "right"] as const).map((a) => (
                <button
                  key={a}
                  className={`nl-pill ${block.data.alignment === a ? "nl-pill-active" : ""}`}
                  onClick={() => onUpdate({ alignment: a })}
                >
                  {a.charAt(0).toUpperCase() + a.slice(1)}
                </button>
              ))}
            </div>
            <div className="nl-toolbar-separator" />
            <span className="nl-settings-label">Icon Size</span>
            <div className="nl-pill-group">
              {([20, 24, 28] as const).map((sz) => (
                <button
                  key={sz}
                  className={`nl-pill ${block.data.iconSize === sz ? "nl-pill-active" : ""}`}
                  onClick={() => onUpdate({ iconSize: sz })}
                >
                  {sz === 20 ? "Small" : sz === 24 ? "Medium" : "Large"}
                </button>
              ))}
            </div>
          </div>

          <div className="nl-block-settings-row">
            <span className="nl-settings-label">Icon Color</span>
            <input
              type="color"
              className="nl-color-swatch"
              value={block.data.iconColor || "#71717a"}
              onChange={(e) => onUpdate({ iconColor: e.target.value })}
            />
            <span style={{ fontSize: "11px", color: "#9ca3af", marginLeft: "8px" }}>Custom tint color for all icons</span>
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
      )}
    </div>
  )
}
