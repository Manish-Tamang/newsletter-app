"use client"

import type { ColumnsData } from "../../core/types"
import { Field, Section, Segmented, TextField } from "../controls"
import type { BlockSettingsProps } from "./types"

export function ColumnsSettings({ block, onUpdate }: BlockSettingsProps<ColumnsData>) {
  const data = block.data
  return (
    <>
      <Section title="Layout">
        <Field label="Style">
          <Segmented
            value={data.variant || "plain"}
            onChange={(variant) => onUpdate({ variant })}
            options={[
              { value: "plain" as const, label: "Open" },
              { value: "card" as const, label: "Card" },
            ]}
          />
        </Field>
      </Section>
      <Section title="Right cell">
        <TextField
          label="Image URL"
          type="url"
          value={data.rightImage || ""}
          placeholder="Optional — replaces the right text"
          onChange={(rightImage) => onUpdate({ rightImage: rightImage.trim() }, { typing: true })}
          hint="Leave empty to keep two text columns"
        />
      </Section>
    </>
  )
}
