"use client"

import { Switch } from "@/components/ui/switch"
import { Code, Type } from "lucide-react"
import { HtmlCodeEditor } from "@/components/html-code-editor"
import { EmailBuilder } from "@/components/EmailBuilder"

interface Props {
  useRawHtml: boolean
  setUseRawHtml: (v: boolean) => void
  rawHtml: string
  setRawHtml: (v: string) => void
  onSaveRich: (html: string) => void
  onExportToHtml: (html: string) => void
  subject: string
  previewHtml: string
}

export function ContentEditor({ useRawHtml, setUseRawHtml, rawHtml, setRawHtml, onSaveRich, onExportToHtml, subject, previewHtml }: Props) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider">EMAIL CONTENT</h2>
          <p className="text-gray-600 mt-2">{useRawHtml ? "Write your HTML email content" : "Create your newsletter content"}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Type className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">Rich Text</span>
          <Switch checked={useRawHtml} onCheckedChange={setUseRawHtml} />
          <Code className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">Raw HTML</span>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg">
        <div className="h-[600px] w-full">
          {useRawHtml ? (
            <HtmlCodeEditor value={rawHtml} onChange={setRawHtml} placeholder="<html><body><h1>Your HTML content here...</h1></body></html>" />
          ) : (
            <EmailBuilder onSave={onSaveRich} onExportToHtml={onExportToHtml} className="w-full h-full" storageKey="campaign-email-design" />
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
}


