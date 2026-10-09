"use client"

import { useRouter } from "next/navigation"
import { TemplateEditor } from "@/components/template-editor"
import { useTemplates } from "@/hooks/use-templates"
import { useEffect, useState, use } from "react"
import { Template } from "@/hooks/use-templates"

interface EditTemplatePageProps {
  params: Promise<{
    id: string
  }>
}

export default function EditTemplatePage({ params }: EditTemplatePageProps) {
  const router = useRouter()
  const { getTemplate, updateTemplate } = useTemplates()
  const [template, setTemplate] = useState<Template | null>(null)
  const [fetching, setFetching] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // Unwrap the params Promise using React.use()
  const { id } = use(params)

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const templateData = await getTemplate(id)
        setTemplate(templateData)
      } catch (error) {
        console.error("Failed to fetch template:", error)
        router.push("/templates")
      } finally {
        setFetching(false)
      }
    }

    fetchTemplate()
  }, [id, getTemplate, router])

  const handleSave = async (templateData: any) => {
    try {
      setSaving(true)
      await updateTemplate(id, templateData)
      router.push("/templates")
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    router.push("/templates")
  }

  if (fetching) {
    return <EditTemplateLoading />
  }

  if (!template) {
    return (
      <div className="max-w-6xl mx-auto space-y-16 py-8 px-6">
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">Template not found</div>
          <button 
            onClick={() => router.push("/templates")}
            className="text-blue-600 hover:underline"
          >
            Back to Templates
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-16 py-8 px-6">
      <div className="space-y-4">
        <h1 className="text-4xl font-medium tracking-tight">Edit Template</h1>
        <p className="text-lg text-gray-600 max-w-2xl">
          Update your email template design and content.
        </p>
      </div>
      
      <TemplateEditor
        template={template}
        onSave={handleSave}
        onCancel={handleCancel}
        loading={saving}
      />
    </div>
  )
}

// Loading component for edit page
function EditTemplateLoading() {
  return (
    <div className="max-w-6xl mx-auto space-y-16 py-8 px-6">
      <div className="space-y-4">
        <div className="h-10 bg-gray-200 rounded w-64"></div>
        <div className="h-6 bg-gray-200 rounded w-80"></div>
      </div>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="h-10 bg-gray-200 rounded-full w-40"></div>
          <div className="flex items-center gap-3">
            <div className="h-10 bg-gray-200 rounded-full w-24"></div>
            <div className="h-10 bg-gray-200 rounded-full w-32"></div>
          </div>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-1 space-y-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-48 mb-6"></div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-10 bg-gray-200 rounded w-full"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-20 bg-gray-200 rounded w-full"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                  <div className="h-10 bg-gray-200 rounded w-full"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-16 bg-gray-200 rounded-lg w-full"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="md:col-span-2">
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-64 mb-6"></div>
              <div className="h-96 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 