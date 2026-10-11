"use client"

import type { BannerData } from "../../core/types"
import { ColorField, Section, Toggle } from "../controls"
import type { BlockSettingsProps } from "./types"

export function BannerSettings({ block, onUpdate }: BlockSettingsProps<BannerData>) {
  const data = block.data
  return (
    <>
      <Section title="Color">
        <ColorField label="Background" value={data.backgroundColor} onChange={(backgroundColor) => onUpdate({ backgroundColor })} />
        <ColorField label="Title" value={data.titleColor} onChange={(titleColor) => onUpdate({ titleColor })} />
        <ColorField label="Subtitle" value={data.subtitleColor} onChange={(subtitleColor) => onUpdate({ subtitleColor })} />
      </Section>
      <Section title="Mark">
        <Toggle label="Accent mark" checked={data.showMark} onChange={(showMark) => onUpdate({ showMark })} />
        {data.showMark ? (
          <ColorField label="Mark" value={data.markColor} onChange={(markColor) => onUpdate({ markColor })} />
        ) : null}
      </Section>
    </>
  )
}
