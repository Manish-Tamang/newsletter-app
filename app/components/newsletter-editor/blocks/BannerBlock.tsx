"use client"

import type { BannerData, BlockComponentProps } from "../core/types"
import { useEditable } from "./useEditable"

export function BannerBlock({ block, onUpdate, isSelected }: BlockComponentProps<BannerData>) {
  const data = block.data

  const eyebrow = useEditable<HTMLParagraphElement>({
    value: data.eyebrow,
    mode: "singleline",
    onChange: (value) => onUpdate({ eyebrow: value }, { typing: true }),
  })
  const title = useEditable<HTMLParagraphElement>({
    value: data.title,
    mode: "singleline",
    onChange: (value) => onUpdate({ title: value }, { typing: true }),
  })
  const subtitle = useEditable<HTMLParagraphElement>({
    value: data.subtitle,
    mode: "singleline",
    onChange: (value) => onUpdate({ subtitle: value }, { typing: true }),
  })

  return (
    <div className="nl-banner-wrap">
      <div className="nl-banner" style={{ backgroundColor: data.backgroundColor }}>
        <div className="nl-banner-copy">
          <p
            ref={eyebrow.ref}
            {...eyebrow.props}
            className="nl-banner-eyebrow"
            style={{ color: data.titleColor, display: data.eyebrow || isSelected ? undefined : "none" }}
            data-placeholder="Eyebrow"
          />
          <p ref={title.ref} {...title.props} className="nl-banner-title" style={{ color: data.titleColor }} data-placeholder="Banner title" />
          <p
            ref={subtitle.ref}
            {...subtitle.props}
            className="nl-banner-subtitle"
            style={{ color: data.subtitleColor, display: data.subtitle || isSelected ? undefined : "none" }}
            data-placeholder="Supporting line"
          />
        </div>
        {data.showMark ? <div className="nl-banner-mark" style={{ backgroundColor: data.markColor }} /> : null}
      </div>
    </div>
  )
}
