"use client"

import { useRef, useEffect } from "react"
import type { BlockComponentProps, FooterData } from "../types"
import { BlockSettings } from "../BlockSettings"
import { AlignPills, ColorField } from "../settings-controls"

export function FooterBlock({ block, onUpdate, isSelected, onSelect }: BlockComponentProps<FooterData>) {
  const textRef = useRef<HTMLParagraphElement>(null)
  const companyRef = useRef<HTMLParagraphElement>(null)
  const addressRef = useRef<HTMLParagraphElement>(null)

  // Sync refs with props
  useEffect(() => {
    if (textRef.current && textRef.current.innerText !== block.data.text) {
      textRef.current.innerText = block.data.text
    }
  }, [block.data.text])

  useEffect(() => {
    if (companyRef.current && companyRef.current.innerText !== block.data.companyName) {
      companyRef.current.innerText = block.data.companyName
    }
  }, [block.data.companyName])

  useEffect(() => {
    if (addressRef.current && addressRef.current.innerText !== block.data.address) {
      addressRef.current.innerText = block.data.address
    }
  }, [block.data.address])

  const handleTextBlur = () => {
    if (textRef.current) {
      onUpdate({ text: textRef.current.innerText })
    }
  }

  const handleCompanyBlur = () => {
    if (companyRef.current) {
      onUpdate({ companyName: companyRef.current.innerText })
    }
  }

  const handleAddressBlur = () => {
    if (addressRef.current) {
      onUpdate({ address: addressRef.current.innerText })
    }
  }

  const alignment = block.data.alignment || "center"

  return (
    <div onClick={onSelect}>
      <div
        className="nl-footer-block"
        style={{
          backgroundColor: block.data.backgroundColor || "#ffffff",
          color: block.data.textColor || "#9ca3af",
          textAlign: alignment,
        }}
      >
        <p
          ref={textRef}
          contentEditable
          suppressContentEditableWarning
          onBlur={handleTextBlur}
          className="nl-footer-editable-text"
          style={{
            margin: "0 0 2px 0",
            outline: "none",
            color: block.data.textColor || "#9ca3af",
          }}
          data-placeholder="Footer description text"
        />
        {block.data.companyName || isSelected ? (
          <p
            ref={companyRef}
            contentEditable
            suppressContentEditableWarning
            onBlur={handleCompanyBlur}
            className="nl-footer-editable-company"
            style={{
              margin: "0",
              outline: "none",
              color: block.data.textColor || "#9ca3af",
            }}
            data-placeholder="Company name"
          />
        ) : null}
        {block.data.address || isSelected ? (
          <p
            ref={addressRef}
            contentEditable
            suppressContentEditableWarning
            onBlur={handleAddressBlur}
            className="nl-footer-editable-address"
            style={{
              margin: "0 0 8px 0",
              outline: "none",
              color: block.data.textColor || "#9ca3af",
            }}
            data-placeholder="Street, city"
          />
        ) : null}
        <p style={{ margin: "0" }}>
          <a
            href={block.data.unsubscribeUrl || "#"}
            onClick={(e) => {
              if (!block.data.unsubscribeUrl) e.preventDefault()
            }}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: block.data.textColor || "#9ca3af",
              textDecoration: "underline",
            }}
          >
            Unsubscribe
          </a>
        </p>
      </div>

      <BlockSettings active={isSelected}>
        <div className="nl-block-settings">
          <div className="nl-block-settings-row">
            <span className="nl-settings-label">Unsubscribe</span>
            <input
              className="nl-settings-input"
              value={block.data.unsubscribeUrl}
              onChange={(e) => onUpdate({ unsubscribeUrl: e.target.value })}
              placeholder="https://example.com/unsubscribe"
            />
          </div>
          <div className="nl-block-settings-row">
            <AlignPills value={alignment} onChange={(next) => onUpdate({ alignment: next })} />
            <ColorField
              label="Background"
              value={block.data.backgroundColor || "#ffffff"}
              onChange={(backgroundColor) => onUpdate({ backgroundColor })}
            />
            <ColorField
              label="Text"
              value={block.data.textColor || "#9ca3af"}
              onChange={(textColor) => onUpdate({ textColor })}
            />
          </div>
        </div>
      </BlockSettings>
    </div>
  )
}
