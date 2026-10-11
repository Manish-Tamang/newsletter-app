"use client"

import type { DividerData } from "../../core/types"
import { ColorField, Field, Section, Segmented } from "../controls"
import type { BlockSettingsProps } from "./types"

export function DividerSettings({ block, onUpdate }: BlockSettingsProps<DividerData>) {
  const data = block.data
  return (
    <Section title="Line">
      <Field label="Style">
        <Segmented
          value={data.style}
          onChange={(style) => onUpdate({ style })}
          options={[
            { value: "solid" as const, label: "Solid" },
            { value: "dashed" as const, label: "Dashed" },
            { value: "dotted" as const, label: "Dotted" },
          ]}
        />
      </Field>
      <ColorField label="Color" value={data.color} onChange={(color) => onUpdate({ color })} />
    </Section>
  )
}
