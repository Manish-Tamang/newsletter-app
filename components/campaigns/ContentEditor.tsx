"use client"

import { forwardRef, useImperativeHandle, useRef } from "react"
import { Switch } from "@/components/ui/switch"
import { Code, Type } from "lucide-react"
import { HtmlCodeEditor } from "@/components/html-code-editor"
import { NewsletterEditor, type NewsletterEditorHandle } from "@/components/newsletter-editor/NewsletterEditor"
import { getNewsletterBlocksHtml } from "@/lib/email-content"

export interface ContentEditorHandle {
  exportLatestHtml: () => Promise<string | null>
}

interface Props {
  useRawHtml: boolean
  setUseRawHtml: (v: boolean) => void
  rawHtml: string
  setRawHtml: (v: string) => void
  onContentChange: (html: string) => void
  subject: string
  previewHtml: string
}

export const ContentEditor = forwardRef<ContentEditorHandle, Props>(function ContentEditor(
  { useRawHtml, setUseRawHtml, rawHtml, setRawHtml, onContentChange, subject, previewHtml },
  ref
) {
  const editorRef = useRef<NewsletterEditorHandle>(null)

  useImperativeHandle(ref, () => ({
    exportLatestHtml: async () => {
      if (useRawHtml) {
        return rawHtml.trim() || null
      }
      const exported = await editorRef.current?.exportHtml()
      return exported || getNewsletterBlocksHtml()
    },
  }))

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider">EMAIL BUILDER</h2>
          <p className="text-gray-600 mt-2">Start from a blank canvas — add blocks to design your email. No template needed.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Type className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">Block Editor</span>
          <Switch checked={useRawHtml} onCheckedChange={setUseRawHtml} />
          <Code className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">Raw HTML</span>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="h-[650px] w-full">
          {useRawHtml ? (
            <HtmlCodeEditor
              value={rawHtml}
              onChange={(value) => {
                setRawHtml(value)
                onContentChange(value)
              }}
              placeholder="<html><body><h1>Your HTML content here...</h1></body></html>"
            />
          ) : (
            <NewsletterEditor
              ref={editorRef}
              onChange={onContentChange}
              className="w-full h-full"
            />
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">PREVIEW</h3>
        <div className="max-w-2xl">
          <div className="border border-gray-200 rounded-lg bg-white">
            <div className="border-b border-gray-100 p-6">
              <div className="font-medium text-lg">{subject || "Email Subject"}</div>
              <div className="text-gray-500 text-sm mt-1">from newsletter@manishtamang.com</div>
            </div>
            <div className="p-6">
              {previewHtml ? (
                <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: previewHtml }} />
              ) : (
                <p className="text-gray-500 italic">Your email content will appear here...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})
