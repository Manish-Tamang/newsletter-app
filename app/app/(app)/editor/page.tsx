"use client"

import { NewsletterEditor } from "@/components/newsletter-editor/NewsletterEditor"

export default function EditorPage() {
  return (
    <div className="-m-6 flex h-[calc(100dvh-4rem)] min-h-[640px] min-w-0 overflow-hidden">
      <NewsletterEditor className="h-full min-w-0 flex-1 rounded-none border-0" />
    </div>
  )
}
