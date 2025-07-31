"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { TemplateEditor } from "@/components/template-editor"
import { useTemplates, Template } from "@/hooks/use-templates"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"

export default function EditTemplatePage() {
  const router = useRouter()
  const params = useParams()
  const { updateTemplate, getTemplate, loading } = useTemplates()
  const [template, setTemplate] = useState<Template | null>(null)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const templateData = await getTemplate(params.id as string)
        setTemplate(templateData)
      } catch (error) {
        // Error handling is done in the hook
        router.push("/templates")
      } finally {
        setFetching(false)
      }
    }

    if (params.id) {
      fetchTemplate()
    }
  }, [params.id, getTemplate, router])

  const handleSave = async (templateData: any) => {
    try {
      await updateTemplate(params.id as string, templateData)
      router.push("/templates")
    } catch (error) {
      // Error handling is done in the hook
    }
  }

  const handleCancel = () => {
    router.push("/templates")
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading template...</p>
        </div>
      </div>
    )
  }

  if (!template) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push("/templates")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Templates
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Template Not Found</CardTitle>
            <CardDescription>
              The template you're looking for doesn't exist or has been deleted.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/templates")}>
              Go Back to Templates
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <TemplateEditor
      template={template}
      onSave={handleSave}
      onCancel={handleCancel}
      loading={loading}
    />
  )
} 