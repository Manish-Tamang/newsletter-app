"use client"

import { useEffect, useRef } from "react"
import type { BannerData, BlockComponentProps } from "../types"
import { BlockSettings } from "../BlockSettings"
import { ColorField } from "../settings-controls"

function usePlain(value: string) {
  const ref = useRef<HTMLParagraphElement>(null)
  useEffect(() => {
    if (ref.current && ref.current.innerText !== value) ref.current.innerText = value
  }, [])
  return ref
}

export function BannerBlock({ block, onUpdate, isSelected, onSelect }: BlockComponentProps<BannerData>) {
  const data = block.data
  const eyebrowRef = usePlain(data.eyebrow)
  const titleRef = usePlain(data.title)
  const subtitleRef = usePlain(data.subtitle)

  return (
    <div onClick={onSelect}>
      <div className="nl-banner-wrap">
        <div className="nl-banner" style={{ backgroundColor: data.backgroundColor }}>
          <div className="nl-banner-copy">
            <p
              ref={eyebrowRef}
              contentEditable
              suppressContentEditableWarning
              className="nl-banner-eyebrow"
              style={{ color: data.titleColor, marginBottom: data.eyebrow ? 8 : 0 }}
              onBlur={() => eyebrowRef.current && onUpdate({ eyebrow: eyebrowRef.current.innerText })}
            />
            <p
              ref={titleRef}
              contentEditable
              suppressContentEditableWarning
              className="nl-banner-title"
              style={{ color: data.titleColor }}
              onBlur={() => titleRef.current && onUpdate({ title: titleRef.current.innerText })}
            />
            <p
              ref={subtitleRef}
              contentEditable
              suppressContentEditableWarning
              className="nl-banner-subtitle"
              style={{ color: data.subtitleColor }}
              onBlur={() => subtitleRef.current && onUpdate({ subtitle: subtitleRef.current.innerText })}
            />
          </div>
          {data.showMark ? <div className="nl-banner-mark" style={{ backgroundColor: data.markColor }} /> : null}
        </div>
      </div>
      <BlockSettings active={isSelected}>
        <div className="nl-block-settings">
          <div className="nl-block-settings-row">
            <ColorField label="Fill" value={data.backgroundColor} onChange={(backgroundColor) => onUpdate({ backgroundColor })} />
            <ColorField label="Title" value={data.titleColor} onChange={(titleColor) => onUpdate({ titleColor })} />
            <ColorField label="Detail" value={data.subtitleColor} onChange={(subtitleColor) => onUpdate({ subtitleColor })} />
            <ColorField label="Mark" value={data.markColor} onChange={(markColor) => onUpdate({ markColor })} />
            <button
              type="button"
              className={`nl-pill ${data.showMark ? "nl-pill-active" : ""}`}
              onClick={() => onUpdate({ showMark: !data.showMark })}
            >
              Mark
            </button>
          </div>
        </div>
      </BlockSettings>
    </div>
  )
}
