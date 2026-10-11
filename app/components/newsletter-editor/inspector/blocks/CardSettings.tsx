"use client"

import type { CardData } from "../../core/types"
import { BUTTON_PALETTE } from "./ButtonSettings"
import { ColorField, Field, Section, Segmented, TextField } from "../controls"
import type { BlockSettingsProps } from "./types"

export function CardSettings({ block, onUpdate, theme }: BlockSettingsProps<CardData>) {
  const data = block.data
  return (
    <>
      <Section title="Media">
        <TextField
          label="Image URL"
          type="url"
          value={data.imageUrl}
          placeholder="https://"
          onChange={(imageUrl) => onUpdate({ imageUrl: imageUrl.trim() }, { typing: true })}
        />
        {data.imageUrl ? (
          <TextField label="Alt text" value={data.imageAlt} onChange={(imageAlt) => onUpdate({ imageAlt }, { typing: true })} />
        ) : null}
      </Section>
      <Section title="Button">
        <TextField
          label="URL"
          type="url"
          value={data.buttonUrl}
          placeholder="https://"
          onChange={(buttonUrl) => onUpdate({ buttonUrl: buttonUrl.trim() }, { typing: true })}
        />
        <Field label="Variant">
          <Segmented
            value={data.buttonVariant}
            onChange={(buttonVariant) => onUpdate({ buttonVariant })}
            options={[
              { value: "filled" as const, label: "Filled" },
              { value: "outline" as const, label: "Outline" },
            ]}
          />
        </Field>
        <ColorField
          label="Button"
          value={data.buttonColor}
          onChange={(buttonColor) => onUpdate({ buttonColor })}
          presets={Array.from(new Set([theme.accentColor, ...BUTTON_PALETTE]))}
        />
      </Section>
    </>
  )
}
