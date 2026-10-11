"use client"

import type { MetaData } from "../../core/types"
import { AlignField, Section, TextField } from "../controls"
import type { BlockSettingsProps } from "./types"

export function MetaSettings({ block, onUpdate }: BlockSettingsProps<MetaData>) {
  const data = block.data
  return (
    <Section title="Value">
      <TextField
        label="Link"
        type="url"
        value={data.valueUrl}
        placeholder="Optional URL for the value"
        onChange={(valueUrl) => onUpdate({ valueUrl: valueUrl.trim() }, { typing: true })}
      />
      <AlignField value={data.alignment} onChange={(alignment) => onUpdate({ alignment })} />
    </Section>
  )
}
