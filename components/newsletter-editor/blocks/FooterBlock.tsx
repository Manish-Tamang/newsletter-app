"use client"

import { useRef, useEffect } from "react"
import type { BlockComponentProps, FooterData } from "../types"

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

  return (
    <div onClick={onSelect}>
      <div
        className="nl-footer-block"
        style={{
          backgroundColor: block.data.backgroundColor || "#f4f4f5",
          color: block.data.textColor || "#71717a",
          padding: "32px 24px",
          textAlign: "center",
          fontSize: "12px",
          lineHeight: "1.6",
        }}
      >
        <p
          ref={textRef}
          contentEditable
          suppressContentEditableWarning
          onBlur={handleTextBlur}
          className="nl-footer-editable-text"
          style={{
            margin: "0 0 8px 0",
            outline: "none",
            color: block.data.textColor || "#71717a",
            opacity: 0.8,
          }}
          data-placeholder="Footer description text"
        />
        <p
          ref={companyRef}
          contentEditable
          suppressContentEditableWarning
          onBlur={handleCompanyBlur}
          className="nl-footer-editable-company"
          style={{
            margin: "0 0 4px 0",
            fontWeight: 600,
            outline: "none",
            color: block.data.textColor || "#71717a",
            opacity: 0.9,
          }}
          data-placeholder="Company Name Inc."
        />
        <p
          ref={addressRef}
          contentEditable
          suppressContentEditableWarning
          onBlur={handleAddressBlur}
          className="nl-footer-editable-address"
          style={{
            margin: "0 0 16px 0",
            outline: "none",
            color: block.data.textColor || "#71717a",
            opacity: 0.7,
          }}
          data-placeholder="123 Street Name, City, Country"
        />
        <p style={{ margin: "0" }}>
          <a
            href={block.data.unsubscribeUrl || "#"}
            onClick={(e) => {
              if (!block.data.unsubscribeUrl) e.preventDefault()
            }}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: block.data.textColor || "#71717a",
              textDecoration: "underline",
              fontWeight: 600,
              opacity: 0.9,
            }}
          >
            Unsubscribe
          </a>
        </p>
      </div>

      {isSelected && (
        <div className="nl-block-settings">
          <div className="nl-block-settings-row">
            <span className="nl-settings-label">Unsubscribe Link</span>
            <input
              className="nl-settings-input"
              value={block.data.unsubscribeUrl}
              onChange={(e) => onUpdate({ unsubscribeUrl: e.target.value })}
              placeholder="https://example.com/unsubscribe"
            />
          </div>
          <div className="nl-block-settings-row">
            <span className="nl-settings-label">Colors</span>
            <span style={{ fontSize: "12px", color: "#6b7280" }}>Background:</span>
            <input
              type="color"
              className="nl-color-swatch"
              value={block.data.backgroundColor || "#f4f4f5"}
              onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
            />
            <span style={{ fontSize: "12px", color: "#6b7280", marginLeft: "12px" }}>Text:</span>
            <input
              type="color"
              className="nl-color-swatch"
              value={block.data.textColor || "#71717a"}
              onChange={(e) => onUpdate({ textColor: e.target.value })}
            />
          </div>
        </div>
      )}
    </div>
  )
}
