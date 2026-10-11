"use client"

import { forwardRef } from "react"
import { NewsletterEditor, type NewsletterEditorHandle } from "@/components/newsletter-editor/NewsletterEditor"
import { EMAIL_STORAGE_KEYS } from "@/lib/email-content"

export type EmailBuilderHandle = NewsletterEditorHandle

interface EmailBuilderProps {
  onSave?: (html: string, design: unknown) => void
  onExportToHtml?: (html: string) => void
  onContentChange?: (html: string) => void
  initialDesign?: unknown
  className?: string
  storageKey?: string
}

export const EmailBuilder = forwardRef<EmailBuilderHandle, EmailBuilderProps>(function EmailBuilder(
  { onContentChange, onSave, className, storageKey = EMAIL_STORAGE_KEYS.campaignBlocks },
  ref
) {
  return (
    <NewsletterEditor
      ref={ref}
      className={className}
      storageKey={storageKey}
      onChange={(html) => {
        onContentChange?.(html)
        onSave?.(html, null)
      }}
    />
  )
})
