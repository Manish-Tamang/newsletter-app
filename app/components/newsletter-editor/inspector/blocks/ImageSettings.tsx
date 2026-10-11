"use client"

import type { ImageData } from "../../core/types"
import { AlignField, Field, Section, Segmented, TextField } from "../controls"
import type { BlockSettingsProps } from "./types"

export function ImageSettings({ block, onUpdate }: BlockSettingsProps<ImageData>) {
  const data = block.data
  return (
    <>
      <Section title="Source">
        <TextField
          label="Image URL"
          type="url"
          value={data.src}
          placeholder="https://example.com/image.jpg"
          onChange={(src) => onUpdate({ src: src.trim() }, { typing: true })}
          hint="Use a publicly hosted image. Inline data is stripped on send."
        />
        <TextField
          label="Alt text"
          value={data.alt}
          placeholder="Describe the image for screen readers"
          onChange={(alt) => onUpdate({ alt }, { typing: true })}
        />
        <TextField
          label="Link"
          type="url"
          value={data.linkUrl}
          placeholder="Optional click-through URL"
          onChange={(linkUrl) => onUpdate({ linkUrl }, { typing: true })}
        />
      </Section>
      <Section title="Layout">
        <Field label="Width">
          <Segmented
            value={data.width}
            onChange={(width) => onUpdate({ width })}
            options={[
              { value: "small" as const, label: "42%" },
              { value: "medium" as const, label: "72%" },
              { value: "full" as const, label: "Full" },
            ]}
          />
        </Field>
        <AlignField value={data.alignment} onChange={(alignment) => onUpdate({ alignment })} />
        <Field label="Corners">
          <Segmented
            value={data.radius ?? 0}
            onChange={(radius) => onUpdate({ radius })}
            options={[
              { value: 0 as const, label: "Square" },
              { value: 8 as const, label: "Soft" },
              { value: 12 as const, label: "Round" },
            ]}
          />
        </Field>
      </Section>
    </>
  )
}
