"use client"

import type { BlockComponentProps, ButtonData } from "../types"

const COLOR_PALETTE = [
  "#18181b", "#3b82f6", "#8b5cf6", "#ec4899",
  "#ef4444", "#f97316", "#22c55e", "#06b6d4",
]

export function ButtonBlock({ block, onUpdate, isSelected, onSelect }: BlockComponentProps<ButtonData>) {
  const { label, url, variant, color, alignment, borderRadius } = block.data

  const radius = borderRadius === "full" ? "50px" : borderRadius === "small" ? "6px" : "0px"

  const buttonStyle: React.CSSProperties = {
    display: "inline-block",
    padding: "12px 28px",
    backgroundColor: variant === "filled" ? color : "transparent",
    color: variant === "filled" ? "#ffffff" : color,
    border: variant === "outline" ? `2px solid ${color}` : "none",
    borderRadius: radius,
    textDecoration: "none",
    fontSize: "15px",
    fontWeight: 600,
    lineHeight: 1,
    cursor: "default",
  }

  return (
    <div onClick={onSelect}>
      <div className="nl-button-preview" style={{ textAlign: alignment }}>
        <span style={buttonStyle}>{label}</span>
      </div>
      {isSelected && (
        <div className="nl-block-settings">
          <div className="nl-block-settings-row">
            <span className="nl-settings-label">Label</span>
            <input
              className="nl-settings-input"
              value={label}
              onChange={(e) => onUpdate({ label: e.target.value })}
              placeholder="Button text"
            />
          </div>
          <div className="nl-block-settings-row">
            <span className="nl-settings-label">URL</span>
            <input
              className="nl-settings-input"
              value={url}
              onChange={(e) => onUpdate({ url: e.target.value })}
              placeholder="https://..."
            />
          </div>
          <div className="nl-block-settings-row">
            <span className="nl-settings-label">Style</span>
            <div className="nl-pill-group">
              {(["filled", "outline"] as const).map((v) => (
                <button
                  key={v}
                  className={`nl-pill ${variant === v ? "nl-pill-active" : ""}`}
                  onClick={() => onUpdate({ variant: v })}
                >
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>
            <div className="nl-toolbar-separator" />
            <span className="nl-settings-label">Radius</span>
            <div className="nl-pill-group">
              {(["none", "small", "full"] as const).map((r) => (
                <button
                  key={r}
                  className={`nl-pill ${borderRadius === r ? "nl-pill-active" : ""}`}
                  onClick={() => onUpdate({ borderRadius: r })}
                >
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="nl-block-settings-row">
            <span className="nl-settings-label">Color</span>
            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              {COLOR_PALETTE.map((c) => (
                <button
                  key={c}
                  className="nl-color-swatch"
                  style={{
                    backgroundColor: c,
                    borderColor: color === c ? "#818cf8" : "#e5e7eb",
                    transform: color === c ? "scale(1.15)" : undefined,
                  }}
                  onClick={() => onUpdate({ color: c })}
                />
              ))}
              <input
                type="color"
                value={color}
                onChange={(e) => onUpdate({ color: e.target.value })}
                className="nl-color-swatch"
                style={{ cursor: "pointer" }}
              />
            </div>
          </div>
          <div className="nl-block-settings-row">
            <span className="nl-settings-label">Align</span>
            <div className="nl-pill-group">
              {(["left", "center", "right"] as const).map((a) => (
                <button
                  key={a}
                  className={`nl-pill ${alignment === a ? "nl-pill-active" : ""}`}
                  onClick={() => onUpdate({ alignment: a })}
                >
                  {a.charAt(0).toUpperCase() + a.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
