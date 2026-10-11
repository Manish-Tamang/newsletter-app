"use client"

import { FONT_OPTIONS, type EmailTheme } from "../core/theme"
import { AlignField, ColorField, Field, NumberField, Section, Segmented, Toggle } from "./controls"

const PAGE_SWATCHES = ["#f3f4f6", "#fafaf9", "#eef2ff", "#111827"]
const CARD_SWATCHES = ["#ffffff", "#fafafa", "#fff7ed", "#18181b"]

export function CanvasSettings({
  theme,
  onChange,
}: {
  theme: EmailTheme
  onChange: (patch: Partial<EmailTheme>) => void
}) {
  return (
    <div className="nl-inspector-stack">
      <div className="nl-inspector-lead">
        <strong>Email</strong>
        <span>Shared type, color, and alignment for every block</span>
      </div>
      <Section title="Layout">
        <AlignField
          label="Align all"
          value={theme.align}
          onChange={(align) => onChange({ align })}
        />
        <NumberField
          label="Side padding"
          value={theme.paddingX}
          min={24}
          max={48}
          onChange={(paddingX) => onChange({ paddingX })}
        />
        <NumberField
          label="Corners"
          value={theme.cardRadius}
          min={0}
          max={16}
          onChange={(cardRadius) => onChange({ cardRadius })}
        />
        <Toggle
          label="Accent bar"
          hint="Thin brand strip at the top of the email"
          checked={theme.showAccentBar}
          onChange={(showAccentBar) => onChange({ showAccentBar })}
        />
      </Section>
      <Section title="Type">
        <Field label="Font">
          <Segmented
            value={theme.font}
            onChange={(font) => onChange({ font })}
            options={FONT_OPTIONS.map((option) => ({ value: option.id, label: option.label }))}
          />
        </Field>
      </Section>
      <Section title="Color">
        <ColorField
          label="Page"
          value={theme.pageBackground}
          onChange={(pageBackground) => onChange({ pageBackground })}
          presets={PAGE_SWATCHES}
        />
        <ColorField
          label="Card"
          value={theme.cardBackground}
          onChange={(cardBackground) => onChange({ cardBackground })}
          presets={CARD_SWATCHES}
        />
        <ColorField label="Heading" value={theme.headingColor} onChange={(headingColor) => onChange({ headingColor })} />
        <ColorField label="Body" value={theme.textColor} onChange={(textColor) => onChange({ textColor })} />
        <ColorField label="Muted" value={theme.mutedColor} onChange={(mutedColor) => onChange({ mutedColor })} />
        <ColorField label="Link" value={theme.linkColor} onChange={(linkColor) => onChange({ linkColor })} />
        <ColorField label="Accent" value={theme.accentColor} onChange={(accentColor) => onChange({ accentColor })} />
      </Section>
    </div>
  )
}
