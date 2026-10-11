"use client"

import { SPACER_HEIGHTS, type SpacerData } from "../../core/types"
import { Field, Section, Segmented } from "../controls"
import type { BlockSettingsProps } from "./types"

export function SpacerSettings({ block, onUpdate }: BlockSettingsProps<SpacerData>) {
  const data = block.data
  return (
    <Section title="Space">
      <Field label="Height" hint="Vertical gap between neighboring blocks">
        <Segmented
          value={data.height}
          onChange={(height) => onUpdate({ height })}
          options={SPACER_HEIGHTS.map((height) => ({
            value: height,
            label: String(height),
            title: `${height}px`,
          }))}
        />
      </Field>
    </Section>
  )
}
