"use client"

import type { ComponentType, CSSProperties } from "react"
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube, FaGlobe } from "react-icons/fa"
import type { BlockComponentProps, SocialLink, SocialsData } from "../core/types"

export const PLATFORM_ICONS: Record<SocialLink["platform"], ComponentType<{ size?: number; style?: CSSProperties }>> = {
  facebook: FaFacebook,
  twitter: FaTwitter,
  instagram: FaInstagram,
  linkedin: FaLinkedin,
  youtube: FaYoutube,
  website: FaGlobe,
}

export const PLATFORM_LABELS: Record<SocialLink["platform"], string> = {
  facebook: "Facebook",
  twitter: "X / Twitter",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  youtube: "YouTube",
  website: "Website",
}

export function SocialsBlock({ block }: BlockComponentProps<SocialsData>) {
  const data = block.data
  const active = data.links.filter((link) => link.enabled)
  const justify = data.alignment === "center" ? "center" : data.alignment === "right" ? "flex-end" : "flex-start"

  return (
    <div className="nl-socials-block" style={{ display: "flex", justifyContent: justify }}>
      {active.length === 0 ? (
        <span className="nl-socials-empty">Enable at least one network in the settings panel</span>
      ) : (
        <div className="nl-socials-row">
          {active.map((link) => {
            const Icon = PLATFORM_ICONS[link.platform]
            return (
              <span key={link.platform} className="nl-social-bubble" style={{ color: data.iconColor || "#4b5563" }} title={PLATFORM_LABELS[link.platform]}>
                <Icon size={data.iconSize} />
              </span>
            )
          })}
        </div>
      )}
    </div>
  )
}
