"use client"

import type { ButtonData } from "../../core/types"
import { AlignField, ColorField, Field, Section, Segmented, TextField } from "../controls"
import type { BlockSettingsProps } from "./types"

export const BUTTON_PALETTE = ["#111827", "#f6821f", "#f97316", "#3b6fd6", "#2563eb", "#16a34a", "#7c3aed", "#e11d48"]

export function ButtonSettings({ block, onUpdate, theme }: BlockSettingsProps<ButtonData>) {
  const data = block.data
  return (
    <>
      <Section title="Link">
        <TextField
          label="Label"
          value={data.label}
          placeholder="Button text"
          onChange={(label) => onUpdate({ label }, { typing: true })}
        />
        <TextField
          label="URL"
          type="url"
          value={data.url}
          placeholder="https://"
          onChange={(url) => onUpdate({ url }, { typing: true })}
          hint={!data.url ? "Buttons without a URL will link to #." : undefined}
        />
      </Section>
      <Section title="Style">
        <Field label="Variant">
          <Segmented
            value={data.variant}
            onChange={(variant) => onUpdate({ variant })}
            options={[
              { value: "filled" as const, label: "Filled" },
              { value: "outline" as const, label: "Outline" },
            ]}
          />
        </Field>
        <Field label="Corners">
          <Segmented
            value={data.borderRadius}
            onChange={(borderRadius) => onUpdate({ borderRadius })}
            options={[
              { value: "none" as const, label: "Square" },
              { value: "small" as const, label: "Soft" },
              { value: "full" as const, label: "Pill" },
            ]}
          />
        </Field>
        <AlignField value={data.alignment} onChange={(alignment) => onUpdate({ alignment })} />
      </Section>
      <Section title="Color">
        <ColorField
          label="Button"
          value={data.color}
          onChange={(color) => onUpdate({ color })}
          presets={Array.from(new Set([theme.accentColor, ...BUTTON_PALETTE]))}
        />
      </Section>
    </>
  )
}
