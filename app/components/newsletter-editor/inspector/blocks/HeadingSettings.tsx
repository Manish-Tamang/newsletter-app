"use client"

import type { HeadingData } from "../../core/types"
import { AlignField, ColorField, Field, Section, Segmented } from "../controls"
import type { BlockSettingsProps } from "./types"

export function HeadingSettings({ block, onUpdate, theme }: BlockSettingsProps<HeadingData>) {
  const data = block.data
  return (
    <>
      <Section title="Style">
        <Field label="Size">
          <Segmented
            value={data.level}
            onChange={(level) => onUpdate({ level })}
            options={[
              { value: 1 as const, label: "Large", title: "28px headline" },
              { value: 2 as const, label: "Medium", title: "18px section title" },
              { value: 3 as const, label: "Small", title: "15px subheading" },
            ]}
          />
        </Field>
        <AlignField value={data.alignment} onChange={(alignment) => onUpdate({ alignment })} />
      </Section>
      <Section title="Color">
        <ColorField
          label="Text"
          value={data.color}
          fallback={theme.headingColor}
          onChange={(color) => onUpdate({ color })}
          onReset={() => onUpdate({ color: "" })}
        />
      </Section>
    </>
  )
}
