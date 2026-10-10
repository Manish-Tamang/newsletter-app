"use client"

import type { CalloutData } from "../../core/types"
import { AlignField, ColorField, NumberField, Section, Toggle } from "../controls"
import type { BlockSettingsProps } from "./types"

export function CalloutSettings({ block, onUpdate }: BlockSettingsProps<CalloutData>) {
  const data = block.data
  return (
    <>
      <Section title="Style">
        <Toggle label="Monospace" hint="Use for codes and IDs" checked={data.mono} onChange={(mono) => onUpdate({ mono })} />
        <AlignField value={data.alignment} onChange={(alignment) => onUpdate({ alignment })} />
        <NumberField label="Corners" value={data.radius} min={0} max={16} onChange={(radius) => onUpdate({ radius })} />
      </Section>
      <Section title="Color">
        <ColorField label="Text" value={data.textColor} onChange={(textColor) => onUpdate({ textColor })} />
        <ColorField label="Background" value={data.backgroundColor} onChange={(backgroundColor) => onUpdate({ backgroundColor })} />
      </Section>
    </>
  )
}
