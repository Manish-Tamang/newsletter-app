"use client"

import { EmailBuilder } from "@/components/EmailBuilder"

export default function EditorPage() {
  const handleSave = (html: string, design: any) => {
    console.log("Email saved:", { html, design })
    // Here you can implement saving to database, API, etc.
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Email Builder</h1>
        <p className="text-gray-600">
          Create beautiful email templates with our drag-and-drop editor. Design responsive emails that look great on all devices.
        </p>
      </div>

      <EmailBuilder 
        onSave={handleSave}
        className="w-full"
      />
    </div>
  )
} 