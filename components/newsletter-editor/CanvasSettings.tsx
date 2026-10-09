"use client"

import type { EmailTheme } from "./theme"
import { FONT_OPTIONS } from "./theme"
import { ColorField } from "./settings-controls"

export function CanvasSettings({
  theme,
  onChange,
}: {
  theme: EmailTheme
  onChange: (partial: Partial<EmailTheme>) => void
}) {
  return (
    <div className="nl-inspector-fields">
      <div className="nl-block-settings-row">
        <ColorField label="Page" value={theme.pageBackground} onChange={(pageBackground) => onChange({ pageBackground })} />
        <ColorField label="Card" value={theme.cardBackground} onChange={(cardBackground) => onChange({ cardBackground })} />
        <ColorField label="Accent" value={theme.accentColor} onChange={(accentColor) => onChange({ accentColor })} />
        <ColorField label="Links" value={theme.linkColor} onChange={(linkColor) => onChange({ linkColor })} />
        <ColorField label="Text" value={theme.textColor} onChange={(textColor) => onChange({ textColor })} />
        <ColorField label="Heading" value={theme.headingColor} onChange={(headingColor) => onChange({ headingColor })} />
      </div>
      <div className="nl-block-settings-row">
        <span className="nl-settings-label">Font</span>
        <div className="nl-pill-group">
          {FONT_OPTIONS.map((font) => (
            <button
              key={font.id}
              type="button"
              className={`nl-pill ${theme.font === font.id ? "nl-pill-active" : ""}`}
              onClick={() => onChange({ font: font.id })}
            >
              {font.label}
            </button>
          ))}
        </div>
      </div>
      <div className="nl-block-settings-row">
        <span className="nl-settings-label">Padding</span>
        <div className="nl-pill-group">
          {[32, 40, 48].map((paddingX) => (
            <button
              key={paddingX}
              type="button"
              className={`nl-pill ${theme.paddingX === paddingX ? "nl-pill-active" : ""}`}
              onClick={() => onChange({ paddingX })}
            >
              {paddingX}
            </button>
          ))}
        </div>
        <span className="nl-settings-label">Corners</span>
        <input
          type="number"
          min={0}
          max={40}
          step={1}
          className="nl-radius-input"
          value={theme.cardRadius}
          onChange={(e) => {
            const next = Number(e.target.value)
            if (Number.isNaN(next)) return
            onChange({ cardRadius: Math.min(40, Math.max(0, next)) })
          }}
        />
        <span className="nl-settings-label">px</span>
        <span className="nl-settings-label">Align</span>
        <div className="nl-pill-group">
          <button
            type="button"
            className={`nl-pill ${theme.align === "left" ? "nl-pill-active" : ""}`}
            onClick={() => onChange({ align: "left" })}
          >
            Left
          </button>
          <button
            type="button"
            className={`nl-pill ${theme.align === "center" ? "nl-pill-active" : ""}`}
            onClick={() => onChange({ align: "center" })}
          >
            Center
          </button>
        </div>
        <button
          type="button"
          className={`nl-pill ${theme.showAccentBar ? "nl-pill-active" : ""}`}
          onClick={() => onChange({ showAccentBar: !theme.showAccentBar })}
        >
          Top bar
        </button>
      </div>
    </div>
  )
}
