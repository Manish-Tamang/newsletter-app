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
    <TemplateEditor
      onSave={handleSave}
      onCancel={handleCancel}
      loading={loading}
    />
  )
} 