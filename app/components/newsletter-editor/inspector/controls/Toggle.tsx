"use client"

export function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string
  hint?: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <label className="nl-toggle-row">
      <span className="nl-toggle-copy">
        <span className="nl-field-label">{label}</span>
        {hint ? <span className="nl-field-hint">{hint}</span> : null}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        className={`nl-switch ${checked ? "nl-is-on" : ""}`}
        onClick={() => onChange(!checked)}
      >
        <span className="nl-switch-thumb" />
      </button>
    </label>
  )
}
