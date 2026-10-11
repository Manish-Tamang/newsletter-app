"use client"

import { SOCIAL_ICON_SIZES, SOCIAL_PLATFORMS, type SocialsData } from "../../core/types"
import { PLATFORM_LABELS } from "../../blocks/SocialsBlock"
import { AlignField, ColorField, Field, Section, Segmented, TextField, Toggle } from "../controls"
import type { BlockSettingsProps } from "./types"

export function SocialsSettings({ block, onUpdate }: BlockSettingsProps<SocialsData>) {
  const data = block.data

  const patchLink = (platform: SocialsData["links"][number]["platform"], next: Partial<SocialsData["links"][number]>) => {
    onUpdate({
      links: data.links.map((link) => (link.platform === platform ? { ...link, ...next } : link)),
    })
  }

  return (
    <>
      <Section title="Networks">
        {SOCIAL_PLATFORMS.map((platform) => {
          const link = data.links.find((item) => item.platform === platform)
          if (!link) return null
          return (
            <div key={platform} className="nl-social-edit">
              <Toggle
                label={PLATFORM_LABELS[platform]}
                checked={link.enabled}
                onChange={(enabled) => patchLink(platform, { enabled })}
              />
              {link.enabled ? (
                <TextField
                  label="URL"
                  type="url"
                  value={link.url}
                  placeholder="https://"
                  onChange={(url) => patchLink(platform, { url })}
                />
              ) : null}
            </div>
          )
        })}
      </Section>
      <Section title="Style">
        <Field label="Size">
          <Segmented
            value={data.iconSize}
            onChange={(iconSize) => onUpdate({ iconSize })}
            options={SOCIAL_ICON_SIZES.map((size) => ({ value: size, label: String(size) }))}
          />
        </Field>
        <AlignField value={data.alignment} onChange={(alignment) => onUpdate({ alignment })} />
        <ColorField label="Icon" value={data.iconColor} onChange={(iconColor) => onUpdate({ iconColor })} />
      </Section>
    </>
  )
}
