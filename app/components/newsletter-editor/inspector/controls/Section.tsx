"use client"

import type { ReactNode } from "react"

export function Section({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="nl-section">
      <header className="nl-section-head">
        <h4>{title}</h4>
        {action}
      </header>
      <div className="nl-section-body">{children}</div>
    </section>
  )
}

export function Field({
  label,
  hint,
  trailing,
  children,
}: {
  label: string
  hint?: string
  trailing?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="nl-field">
      <div className="nl-field-head">
        <span className="nl-field-label">{label}</span>
        {trailing}
      </div>
      {children}
      {hint ? <p className="nl-field-hint">{hint}</p> : null}
    </div>
  )
}

export function FieldRow({ children }: { children: ReactNode }) {
  return <div className="nl-field-row">{children}</div>
}
