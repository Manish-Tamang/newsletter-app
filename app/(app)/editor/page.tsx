"use client"

import { NewsletterEditor } from "@/components/newsletter-editor/NewsletterEditor"

export default function EditorPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Email Builder</h1>
        <p className="text-gray-600">
          Create beautiful email newsletters with the block editor. Design responsive emails that look great on all devices.
        </p>
      </div>

      <NewsletterEditor className="w-full min-h-[600px]" />
    </div>
  )
}
