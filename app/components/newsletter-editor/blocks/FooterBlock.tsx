"use client"

import type { BlockComponentProps, FooterData } from "../core/types"
import { useEditable } from "./useEditable"

export function FooterBlock({ block, onUpdate, isSelected }: BlockComponentProps<FooterData>) {
  const data = block.data
  const alignment = data.alignment || "center"
  const color = data.textColor || "#9ca3af"

  const text = useEditable<HTMLParagraphElement>({
    value: data.text,
    mode: "text",
    onChange: (value) => onUpdate({ text: value }, { typing: true }),
  })
  const company = useEditable<HTMLParagraphElement>({
    value: data.companyName,
    mode: "singleline",
    onChange: (value) => onUpdate({ companyName: value }, { typing: true }),
  })
  const address = useEditable<HTMLParagraphElement>({
    value: data.address,
    mode: "singleline",
    onChange: (value) => onUpdate({ address: value }, { typing: true }),
  })

  return (
    <div className="nl-footer-block" style={{ backgroundColor: data.backgroundColor || "#ffffff", color, textAlign: alignment }}>
      <p ref={text.ref} {...text.props} className="nl-footer-line" data-placeholder="Why the reader is receiving this email" />
      <p
        ref={company.ref}
        {...company.props}
        className="nl-footer-line"
        style={{ display: data.companyName || isSelected ? undefined : "none" }}
        data-placeholder="Company name"
      />
      <p
        ref={address.ref}
        {...address.props}
        className="nl-footer-line nl-footer-address"
        style={{ display: data.address || isSelected ? undefined : "none" }}
        data-placeholder="Street, city, country"
      />
      <p className="nl-footer-unsubscribe">
        <a href={data.unsubscribeUrl || "#"} onClick={(event) => event.preventDefault()} style={{ color }}>
          Unsubscribe
        </a>
      </p>
    </div>
  )
}
