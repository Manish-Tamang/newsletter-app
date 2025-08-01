"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { EmailBuilder } from "@/components/EmailBuilder"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Eye, Save, X, Type, Code } from "lucide-react"
import { Template } from "@/hooks/use-templates"

interface TemplateEditorProps {
  template?: Template
  onSave: (templateData: Omit<Template, "id" | "createdAt" | "updatedAt" | "usage">) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

export function TemplateEditor({ template, onSave, onCancel, loading = false }: TemplateEditorProps) {
  const [name, setName] = useState(template?.name || "")
  const [description, setDescription] = useState(template?.description || "")
  const [category, setCategory] = useState(template?.category || "General")
  const [content, setContent] = useState(template?.content || "")
  const [htmlContent, setHtmlContent] = useState(template?.htmlContent || "")
  const [isHtml, setIsHtml] = useState(template?.isHtml || false)
  const [showPreview, setShowPreview] = useState(false)

  const handleSave = async () => {
    if (!name.trim()) {
      return
    }

    await onSave({
      name: name.trim(),
      description: description.trim(),
      category,
      content: isHtml ? htmlContent : content,
      htmlContent: isHtml ? htmlContent : content,
      isHtml,
    })
  }

  const getPreviewContent = () => {
    if (isHtml) {
      return htmlContent
    }
    return content
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {template ? "Edit Template" : "Create New Template"}
          </h1>
          <p className="text-muted-foreground">
            {template ? "Update your email template" : "Create a reusable email template"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowPreview(true)}
            disabled={!getPreviewContent().trim()}
          >
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button variant="outline" onClick={onCancel}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading || !name.trim()}>
            <Save className="mr-2 h-4 w-4" />
            {loading ? "Saving..." : "Save Template"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Template Details */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Template Details</CardTitle>
              <CardDescription>Basic information about your template</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Template Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter template name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your template"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="General">General</SelectItem>
                    <SelectItem value="Newsletter">Newsletter</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Onboarding">Onboarding</SelectItem>
                    <SelectItem value="Promotional">Promotional</SelectItem>
                    <SelectItem value="Transactional">Transactional</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Editor Type</Label>
                <div className="flex items-center space-x-2">
                  <Type className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Rich Text</span>
                  <Switch
                    checked={isHtml}
                    onCheckedChange={setIsHtml}
                  />
                  <Code className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Raw HTML</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Template Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Category:</span>
                <Badge variant="outline">{category}</Badge>
              </div>
              {template && (
                <>
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
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Content Editor */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Template Content</CardTitle>
              <CardDescription>
                {isHtml 
                  ? "Write your HTML email template" 
                  : "Create your template content with our rich text editor"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isHtml ? (
                <div className="space-y-2">
                  <Label htmlFor="htmlContent">HTML Content</Label>
                  <Textarea
                    id="htmlContent"
                    placeholder="<html><body><h1>Your HTML content here...</h1></body></html>"
                    value={htmlContent}
                    onChange={(e) => setHtmlContent(e.target.value)}
                    className="min-h-[400px] font-mono text-sm"
                  />
                  <p className="text-sm text-gray-500">
                    Write your complete HTML email template. You can use variables like {"{{name}}"} which will be replaced automatically.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <EmailBuilder
                    onSave={(html) => setContent(html)}
                    className="w-full"
                  />
                  <p className="text-sm text-gray-500">
                    Use the drag-and-drop editor to create your email template. Variables like {"{{name}}"} will be replaced automatically.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Template Preview</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(false)}
              >
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