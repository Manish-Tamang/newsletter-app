"use client"

import { useState, type FormEvent } from "react"
import { ImageIcon, Link2 } from "lucide-react"
import { logoSrcError, type BlockComponentProps, type LogoData } from "../core/types"

export function LogoBlock({ block, onUpdate, isSelected }: BlockComponentProps<LogoData>) {
  const data = block.data
  const [draft, setDraft] = useState("")
  const [failed, setFailed] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const src = draft.trim()
    const message = logoSrcError(src)
    if (message) {
      setError(message)
      return
    }
    setError(null)
    setFailed(false)
    onUpdate({ src })
    setDraft("")
  }

  if (!data.src) {
    return (
      <div className={`nl-logo-block nl-align-${data.alignment}`}>
        <div className={`nl-image-placeholder ${isSelected ? "nl-is-selected" : ""}`}>
          <div className="nl-image-placeholder-icon">
            <ImageIcon size={18} />
          </div>
          <div className="nl-image-placeholder-copy">
            <strong>Add a logo</strong>
            <span>Hosted SVG, PNG, or JPG. Brand text is not used here.</span>
          </div>
          <form className="nl-image-placeholder-form" onSubmit={submit} onMouseDown={(event) => event.stopPropagation()}>
            <Link2 size={14} />
            <input
              value={draft}
              onChange={(event) => {
                setDraft(event.target.value)
                setError(null)
              }}
              placeholder="https://example.com/logo.svg"
              aria-label="Logo image URL"
            />
            <button type="submit" disabled={!draft.trim()}>
              Add
            </button>
          </form>
          {error ? <span className="nl-field-hint">{error}</span> : null}
        </div>
      </div>
    )
  }

  return (
    <div className={`nl-logo-block nl-align-${data.alignment}`}>
      {failed ? (
        <div className="nl-image-broken" style={{ width: data.width || 120 }}>
          <ImageIcon size={16} />
          <span>Logo could not be loaded</span>
        </div>
      ) : (
        <img
          src={data.src}
          alt={data.alt || "Logo"}
          style={{ width: data.width || 120 }}
          onError={() => setFailed(true)}
          onLoad={() => setFailed(false)}
          draggable={false}
        />
      )}
      {data.showRule ? <div className="nl-logo-rule" style={{ backgroundColor: data.ruleColor }} /> : null}
    </div>
  )
}
