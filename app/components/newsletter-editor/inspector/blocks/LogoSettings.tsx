"use client"

import { logoSrcError, type LogoData } from "../../core/types"
import { AlignField, ColorField, NumberField, Section, TextField, Toggle } from "../controls"
import type { BlockSettingsProps } from "./types"

export function LogoSettings({ block, onUpdate, theme }: BlockSettingsProps<LogoData>) {
  const data = block.data
  const error = data.src ? logoSrcError(data.src) : null

  return (
    <>
      <Section title="Image">
        <TextField
          label="File URL"
          type="url"
          value={data.src}
          placeholder="https://example.com/logo.svg"
          onChange={(src) => onUpdate({ src: src.trim() }, { typing: true })}
          hint={error || "SVG, PNG, or JPG from a public URL"}
        />
        <TextField
          label="Alt text"
          value={data.alt}
          placeholder="Brand name"
          onChange={(alt) => onUpdate({ alt }, { typing: true })}
        />
        <NumberField label="Width" value={data.width || 120} min={32} max={240} onChange={(width) => onUpdate({ width })} />
        <AlignField value={data.alignment} onChange={(alignment) => onUpdate({ alignment })} />
      </Section>
      <Section title="Rule">
        <Toggle label="Accent rule" hint="Short line under the mark" checked={data.showRule} onChange={(showRule) => onUpdate({ showRule })} />
        {data.showRule ? (
          <ColorField
            label="Rule"
            value={data.ruleColor}
            fallback={theme.accentColor}
            onChange={(ruleColor) => onUpdate({ ruleColor })}
          />
        ) : null}
      </Section>
    </>
  )
}
