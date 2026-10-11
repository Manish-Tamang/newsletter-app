"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { NewsletterEditor, type NewsletterEditorHandle } from "@/components/newsletter-editor/NewsletterEditor"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Eye, Save, X, Type, Code, ArrowLeft } from "lucide-react"
import { Template } from "@/hooks/use-templates"
import { captureEmailPreviewScreenshot, validateScreenshot, autoOptimizeScreenshot } from "@/lib/screenshot"
import {
  EMAIL_STORAGE_KEYS,
  getNewsletterBlocksHtml,
  loadDraftFromStorage,
  saveDraftToStorage,
} from "@/lib/email-content"

interface TemplateEditorProps {
  template?: Template
  onSave: (templateData: Omit<Template, "id" | "createdAt" | "updatedAt" | "usage">) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

export function TemplateEditor({ template, onSave, onCancel, loading = false }: TemplateEditorProps) {
  const editorRef = useRef<NewsletterEditorHandle>(null)
  const [name, setName] = useState(template?.name || "")
  const [description, setDescription] = useState(template?.description || "")
  const [category, setCategory] = useState(template?.category || "General")
  const [content, setContent] = useState(template?.content || "")
  const [isHtml, setIsHtml] = useState(template?.isHtml || false)
  const [showPreview, setShowPreview] = useState(false)
  const [isCapturingScreenshot, setIsCapturingScreenshot] = useState(false)
  const [autoSaveStatus, setAutoSaveStatus] = useState("")

  useEffect(() => {
    if (template?.content) return

    const draft = loadDraftFromStorage<{
      name?: string
      description?: string
      category?: string
      content?: string
      isHtml?: boolean
    }>(EMAIL_STORAGE_KEYS.templateDraft)

    if (draft) {
      if (draft.name) setName(draft.name)
      if (draft.description) setDescription(draft.description)
      if (draft.category) setCategory(draft.category)
      if (typeof draft.isHtml === "boolean") setIsHtml(draft.isHtml)
      if (draft.content) setContent(draft.content)
    }

    const blocksHtml = getNewsletterBlocksHtml(EMAIL_STORAGE_KEYS.templateBlocks)
    if (blocksHtml && !draft?.content && !template?.content) {
      setContent(blocksHtml)
    }
  }, [template?.content])

  useEffect(() => {
    const timer = setTimeout(() => {
      saveDraftToStorage(EMAIL_STORAGE_KEYS.templateDraft, {
        name,
        description,
        category,
        content,
        isHtml,
      })
      setAutoSaveStatus("Draft auto-saved")
      setTimeout(() => setAutoSaveStatus(""), 2000)
    }, 1000)

    return () => clearTimeout(timer)
  }, [name, description, category, content, isHtml])

  const resolveContent = async () => {
    if (isHtml) return content.trim()
    const exported = await editorRef.current?.exportHtml()
    return exported?.trim() || content.trim() || getNewsletterBlocksHtml(EMAIL_STORAGE_KEYS.templateBlocks) || ""
  }

  const handleSave = async () => {
    if (!name.trim()) return

    try {
      setIsCapturingScreenshot(true)
      const finalContent = await resolveContent()

      if (!finalContent) return

      let previewImage = template?.previewImage || undefined

      try {
        const screenshot = await captureEmailPreviewScreenshot(finalContent)
        const optimizedScreenshot = await autoOptimizeScreenshot(screenshot)
        const validation = validateScreenshot(optimizedScreenshot)
        if (validation.isValid && validation.screenshot) {
          previewImage = validation.screenshot.dataUrl
        }
      } catch (error) {
        console.warn("Failed to capture screenshot:", error)
      }

      await onSave({
        name: name.trim(),
        description: description.trim(),
        category: category.trim(),
        content: finalContent,
        isHtml: true,
        previewImage,
      })

      setContent(finalContent)
    } catch (error) {
      console.error("Failed to save template:", error)
    } finally {
      setIsCapturingScreenshot(false)
    }
  }

  const getPreviewContent = () => content

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onCancel} className="rounded-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Templates
          </Button>
          {autoSaveStatus && <span className="text-xs text-gray-500">{autoSaveStatus}</span>}
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setShowPreview(true)}
            disabled={!getPreviewContent().trim()}
            className="rounded-full"
          >
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading || !name.trim() || isCapturingScreenshot}
            className="bg-black text-white hover:bg-gray-800 rounded-full px-6"
          >
            <Save className="mr-2 h-4 w-4" />
            {loading ? "Saving..." : isCapturingScreenshot ? "Capturing..." : "Save Template"}
          </Button>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1 space-y-6">
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Template Details</CardTitle>
              <CardDescription className="text-gray-600">Basic information about your template</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">Template Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter template name"
                  className="border-gray-300 focus:border-black focus:ring-black"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your template"
                  rows={3}
                  className="border-gray-300 focus:border-black focus:ring-black"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-medium text-gray-700">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="border-gray-300 focus:border-black focus:ring-black">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="General">General</SelectItem>
                    <SelectItem value="Newsletter">Newsletter</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Onboarding">Onboarding</SelectItem>
                    <SelectItem value="Events">Events</SelectItem>
                    <SelectItem value="Promotional">Promotional</SelectItem>
                    <SelectItem value="Transactional">Transactional</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Editor Type</Label>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Type className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Visual Builder</span>
                  </div>
                  <Switch
                    checked={isHtml}
                    onCheckedChange={setIsHtml}
                    className="data-[state=checked]:bg-black"
                  />
                  <div className="flex items-center space-x-2">
                    <Code className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Raw HTML</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {template && (
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-medium">Template Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Category:</span>
                  <Badge variant="outline" className="bg-gray-100 text-gray-700">{category}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Created:</span>
                  <span className="text-sm text-gray-900">
                    {new Date(template.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Last Modified:</span>
                  <span className="text-sm text-gray-900">
                    {new Date(template.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Usage:</span>
                  <span className="text-sm text-gray-900">{template.usage} times</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="md:col-span-2">
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Template Content</CardTitle>
              <CardDescription className="text-gray-600">
                {isHtml
                  ? "Write your HTML email template"
                  : "Create your template with the block editor. Changes auto-save as you build."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isHtml ? (
                <div className="space-y-2">
                  <Label htmlFor="content" className="text-sm font-medium text-gray-700">HTML Content</Label>
                  <Textarea
                    id="content"
                    placeholder="<html><body><h1>Your HTML content here...</h1></body></html>"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[400px] font-mono text-sm border-gray-300 focus:border-black focus:ring-black"
                  />
                </div>
              ) : (
                <NewsletterEditor
                  ref={editorRef}
                  storageKey={EMAIL_STORAGE_KEYS.templateBlocks}
                  onChange={(html) => setContent(html)}
                  className="w-full h-full min-h-[400px]"
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Template Preview</span>
              <Button variant="ghost" size="sm" onClick={() => setShowPreview(false)}>
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg bg-white">
              <div className="border-b border-gray-100 p-4">
                <div className="font-medium text-gray-900">{name || "Template Name"}</div>
                <div className="text-gray-500 text-xs mt-1">from newsletter@manishtamang.com</div>
              </div>
              <div className="p-6">
                {getPreviewContent() ? (
                  <div
                    className="prose prose-lg max-w-none text-gray-900"
                    dangerouslySetInnerHTML={{ __html: getPreviewContent() }}
                  />
                ) : (
                  <p className="text-gray-500 italic">Your template content will appear here...</p>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
