"use client"

import type { BlockComponentProps, ButtonData } from "../types"
import { BlockSettings } from "../BlockSettings"
import { AlignPills } from "../settings-controls"

const COLOR_PALETTE = ["#111827", "#f6821f", "#f97316", "#3b6fd6", "#16a34a", "#111111", "#7c3aed", "#e11d48"]

export function ButtonBlock({ block, onUpdate, isSelected, onSelect }: BlockComponentProps<ButtonData>) {
  const { label, url, variant, color, alignment, borderRadius } = block.data
  const radius = borderRadius === "full" ? "999px" : borderRadius === "small" ? "6px" : "0px"

  const buttonStyle: React.CSSProperties = {
    display: "inline-block",
    padding: "10px 18px",
    backgroundColor: variant === "filled" ? color : "transparent",
    color: variant === "filled" ? "#ffffff" : color,
    border: variant === "outline" ? `1px solid ${color}` : "none",
    borderRadius: radius,
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: 600,
    lineHeight: 1.2,
    letterSpacing: "-0.01em",
  }

  return (
    <div onClick={onSelect}>
      <div className="nl-button-preview" style={{ textAlign: alignment }}>
        <span
          style={buttonStyle}
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => onUpdate({ label: e.currentTarget.innerText })}
        >
          {label}
        </span>
      </div>
      <BlockSettings active={isSelected}>
        <div className="nl-block-settings">
          <div className="nl-block-settings-row">
            <span className="nl-settings-label">URL</span>
            <input
              className="nl-settings-input"
              value={url}
              onChange={(e) => onUpdate({ url: e.target.value })}
              placeholder="https://"
            />
          </div>
          <div className="nl-block-settings-row">
            <span className="nl-settings-label">Style</span>
            <div className="nl-pill-group">
              {(["filled", "outline"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  className={`nl-pill ${variant === v ? "nl-pill-active" : ""}`}
                  onClick={() => onUpdate({ variant: v })}
                >
                  {v === "filled" ? "Filled" : "Outline"}
                </button>
              ))}
            </div>
            <span className="nl-settings-label">Radius</span>
            <div className="nl-pill-group">
              {(["none", "small", "full"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  className={`nl-pill ${borderRadius === r ? "nl-pill-active" : ""}`}
                  onClick={() => onUpdate({ borderRadius: r })}
                >
                  {r === "full" ? "Pill" : r === "small" ? "Soft" : "Square"}
                </button>
              ))}
            </div>
            <AlignPills value={alignment} onChange={(next) => onUpdate({ alignment: next })} />
          </div>
          <div className="nl-block-settings-row">
            <span className="nl-settings-label">Color</span>
            <div className="nl-swatch-row">
              {COLOR_PALETTE.map((swatch) => (
                <button
                  key={swatch}
                  type="button"
                  className="nl-color-swatch"
                  style={{
                    backgroundColor: swatch,
                    borderColor: color === swatch ? "#818cf8" : "#e5e7eb",
                  }}
                  onClick={() => onUpdate({ color: swatch })}
                />
              ))}
              <input
                type="color"
                value={color}
                onChange={(e) => onUpdate({ color: e.target.value })}
                className="nl-color-swatch"
              />
            </div>
          </div>
        </div>
      </BlockSettings>
    </div>
  )
}
