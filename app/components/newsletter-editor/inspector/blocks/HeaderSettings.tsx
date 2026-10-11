"use client"

import type { HeaderData } from "../../core/types"
import { AlignField, ColorField, NumberField, Section, TextField, Toggle } from "../controls"
import type { BlockSettingsProps } from "./types"

export function HeaderSettings({ block, onUpdate }: BlockSettingsProps<HeaderData>) {
  const data = block.data
  return (
    <>
      <Section title="Brand">
        <TextField
          label="Logo URL"
          type="url"
          value={data.logoUrl}
          placeholder="https://"
          onChange={(logoUrl) => onUpdate({ logoUrl: logoUrl.trim() }, { typing: true })}
        />
        {data.logoUrl ? (
          <NumberField label="Logo width" value={data.logoWidth || 120} min={48} max={200} onChange={(logoWidth) => onUpdate({ logoWidth })} />
        ) : null}
        <Toggle label="Show date" checked={data.showDate} onChange={(showDate) => onUpdate({ showDate })} />
        <AlignField value={data.alignment} onChange={(alignment) => onUpdate({ alignment })} />
      </Section>
      <Section title="Color">
        <ColorField label="Text" value={data.textColor} onChange={(textColor) => onUpdate({ textColor })} />
        <ColorField label="Background" value={data.backgroundColor} onChange={(backgroundColor) => onUpdate({ backgroundColor })} />
      </Section>
    </>
  )
}
