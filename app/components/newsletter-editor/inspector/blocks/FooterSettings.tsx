"use client"

import type { FooterData } from "../../core/types"
import { AlignField, ColorField, Section, TextField } from "../controls"
import type { BlockSettingsProps } from "./types"

export function FooterSettings({ block, onUpdate }: BlockSettingsProps<FooterData>) {
  const data = block.data
  return (
    <>
      <Section title="Links">
        <TextField
          label="Unsubscribe URL"
          type="url"
          value={data.unsubscribeUrl}
          placeholder="https://"
          onChange={(unsubscribeUrl) => onUpdate({ unsubscribeUrl: unsubscribeUrl.trim() }, { typing: true })}
          hint="Required for commercial email. Uses # until set."
        />
        <AlignField value={data.alignment} onChange={(alignment) => onUpdate({ alignment })} />
      </Section>
      <Section title="Color">
        <ColorField label="Text" value={data.textColor} onChange={(textColor) => onUpdate({ textColor })} />
        <ColorField label="Background" value={data.backgroundColor} onChange={(backgroundColor) => onUpdate({ backgroundColor })} />
      </Section>
    </>
  )
}
