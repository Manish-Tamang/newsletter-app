"use client"

import { useRouter } from "next/navigation"
import { TemplateEditor } from "@/components/template-editor"
import { useTemplates } from "@/hooks/use-templates"

export default function NewTemplatePage() {
  const router = useRouter()
  const { createTemplate, loading } = useTemplates()

  const handleSave = async (templateData: any) => {
    try {
      await createTemplate(templateData)
      router.push("/templates")
    } catch (error) {
      // Error handling is done in the hook
    }
  }

  const handleCancel = () => {
    router.push("/templates")
  }

  return (
    <div className="max-w-4xl mx-auto space-y-16 py-8 px-6">
      <div className="space-y-4">
        <h1 className="text-4xl font-medium tracking-tight">Create New Template</h1>
        <p className="text-lg text-gray-600 max-w-2xl">
          Design a beautiful, responsive email template that you can reuse across your campaigns.
        </p>
      </div>
      
      <TemplateEditor
        onSave={handleSave}
        onCancel={handleCancel}
        loading={loading}
      />
    </div>
  )
} 