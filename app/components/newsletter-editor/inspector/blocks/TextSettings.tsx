"use client"

import type { TextData } from "../../core/types"
import { AlignField, ColorField, Field, Section, Segmented } from "../controls"
import type { BlockSettingsProps } from "./types"

export function TextSettings({ block, onUpdate, theme }: BlockSettingsProps<TextData>) {
  const data = block.data
  const size = data.size || "body"
  return (
    <>
      <Section title="Style">
        <Field label="Size">
          <Segmented
            value={size}
            onChange={(next) => onUpdate({ size: next })}
            options={[
              { value: "small" as const, label: "Small", title: "13px, muted" },
              { value: "body" as const, label: "Body", title: "14px" },
              { value: "large" as const, label: "Lead", title: "16px, heading color" },
            ]}
          />
        </Field>
        <AlignField value={data.alignment} onChange={(alignment) => onUpdate({ alignment })} />
      </Section>
      <Section title="Color">
        <ColorField
          label="Text"
          value={data.color}
          fallback={size === "small" ? theme.mutedColor : size === "large" ? theme.headingColor : theme.textColor}
          onChange={(color) => onUpdate({ color })}
          onReset={() => onUpdate({ color: "" })}
        />
      </Section>
    </>
  )
}
