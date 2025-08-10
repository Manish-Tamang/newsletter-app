"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { TemplatePreviewEditor } from "@/components/template-preview-editor"
import { useTemplates, Template } from "@/hooks/use-templates"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function TemplateDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { updateTemplate, getTemplate, deleteTemplate } = useTemplates()
  const [template, setTemplate] = useState<Template | null>(null)
  const [fetching, setFetching] = useState(true)
  const [showEditor, setShowEditor] = useState(false)
  const [saving, setSaving] = useState(false)

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

  const handleSave = async (templateData: Partial<Template>) => {
    try {
      setSaving(true)
      const updatedTemplate = await updateTemplate(params.id as string, templateData)
      setTemplate(updatedTemplate)
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      await deleteTemplate(params.id as string)
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push("/templates")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Templates
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowEditor(!showEditor)}
          >
            {showEditor ? "Hide Editor" : "Show Editor"}
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Template
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Template</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{template.name}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {showEditor ? (
        <TemplatePreviewEditor
          template={template}
          onSave={handleSave}
          onCancel={handleCancel}
          loading={saving}
        />
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{template.name}</h1>
              <p className="text-muted-foreground">{template.description}</p>
            </div>
            <Button onClick={() => setShowEditor(true)}>
              Edit Template
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Template Info */}
            <div className="md:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Template Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Category:</span>
                      <span className="text-sm font-medium">{template.category}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Created:</span>
                      <span className="text-sm font-medium">
                        {new Date(template.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Last Modified:</span>
                      <span className="text-sm font-medium">
                        {new Date(template.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Usage:</span>
                      <span className="text-sm font-medium">{template.usage} times</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Type:</span>
                      <span className="text-sm font-medium">
                        {template.isHtml ? "Raw HTML" : "Rich Text"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Preview */}
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Template Preview</CardTitle>
                  <CardDescription>How your template will appear in emails</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border border-gray-200 rounded-lg bg-white">
                    <div className="border-b border-gray-100 p-4">
                      <div className="font-medium text-gray-900">{template.name}</div>
                      <div className="text-gray-500 text-xs mt-1">from newsletter@manishtamang.com</div>
                    </div>
                    <div className="p-6">
                      {template.content ? (
                        <div
                          className="prose prose-lg max-w-none text-gray-900"
                          dangerouslySetInnerHTML={{ __html: template.content }}
                        />
                      ) : (
                        <p className="text-gray-500 italic">No content available...</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 