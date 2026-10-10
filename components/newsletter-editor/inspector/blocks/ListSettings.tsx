"use client"

import type { ListData } from "../../core/types"
import { AlignField, ColorField, Field, Section, Segmented } from "../controls"
import type { BlockSettingsProps } from "./types"

export function ListSettings({ block, onUpdate, theme }: BlockSettingsProps<ListData>) {
  const data = block.data
  return (
    <>
      <Section title="Style">
        <Field label="Markers">
          <Segmented
            value={data.style}
            onChange={(style) => onUpdate({ style })}
            options={[
              { value: "bullet" as const, label: "Bullets" },
              { value: "number" as const, label: "Numbers" },
            ]}
          />
        </Field>
        <AlignField value={data.alignment} onChange={(alignment) => onUpdate({ alignment })} />
      </Section>
      <Section title="Color">
        <ColorField
          label="Marker"
          value={data.markerColor}
          fallback={theme.linkColor}
          onChange={(markerColor) => onUpdate({ markerColor })}
        />
      </Section>
    </>
  )
}
