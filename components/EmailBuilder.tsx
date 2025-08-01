"use client"

import { useState, useRef } from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Save, Eye } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Dynamically import the EmailEditor with SSR disabled
const EmailEditor = dynamic(() => import("react-email-editor"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-96">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading email editor...</p>
      </div>
    </div>
  ),
})

interface EmailBuilderProps {
  onSave?: (html: string, design: any) => void
  initialDesign?: any
  className?: string
}

export function EmailBuilder({ onSave, initialDesign, className }: EmailBuilderProps) {
  const emailEditorRef = useRef<any>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [previewHtml, setPreviewHtml] = useState("")
  const [isExporting, setIsExporting] = useState(false)

  const exportHtml = () => {
    if (emailEditorRef.current) {
      setIsExporting(true)
      emailEditorRef.current.exportHtml((data: any) => {
        const { html } = data
        setPreviewHtml(html)
        setIsPreviewOpen(true)
        setIsExporting(false)
      })
    }
  }

  const saveDesign = () => {
    if (emailEditorRef.current) {
      emailEditorRef.current.saveDesign((design: any) => {
        emailEditorRef.current.exportHtml((data: any) => {
          const { html } = data
          if (onSave) {
            onSave(html, design)
          }
        })
      })
    }
  }

  const onLoad = () => {
    console.log("Email editor loaded")
  }

  const onReady = () => {
    console.log("Email editor ready")
  }

  const onDesignLoad = (data: any) => {
    console.log("Design loaded", data)
  }

  const onDesignSave = (data: any) => {
    console.log("Design saved", data)
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Email Builder</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={exportHtml}
                disabled={isExporting}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Preview
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={saveDesign}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Save
              </Button>
              <Button
                size="sm"
                onClick={exportHtml}
                disabled={isExporting}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                {isExporting ? "Exporting..." : "Export HTML"}
              </Button>
            </div>
          </CardTitle>
          <CardDescription>
            Drag and drop elements to create your email template. Use the toolbar on the left to add content blocks.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[600px] w-full">
            <EmailEditor
              ref={emailEditorRef}
              onLoad={onLoad}
              onReady={onReady}
              onDesignLoad={onDesignLoad}
              onDesignSave={onDesignSave}
              projectId={123456} // Replace with your actual project ID
              style={{ height: "100%", width: "100%" }}
              options={{
                displayMode: "emailMode",
                features: {
                  preview: true,
                  imageEditor: true,
                  stockImages: true,
                  textEditor: {
                    spellChecker: true,
                  },
                },
                appearance: {
                  theme: "light",
                  panels: {
                    tools: {
                      dock: "left",
                    },
                  },
                },
                user: {
                  id: 1,
                  name: "User",
                  email: "user@example.com",
                },
                mergeTags: [
                  { name: "First Name", value: "{{first_name}}", sample: "John" },
                  { name: "Last Name", value: "{{last_name}}", sample: "Doe" },
                  { name: "Email", value: "{{email}}", sample: "john@example.com" },
                  { name: "Company", value: "{{company}}", sample: "Acme Inc" },
                ],
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Email Preview</DialogTitle>
            <DialogDescription>
              This is how your email will look when sent to subscribers.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg bg-white">
              <div className="border-b border-gray-100 p-4">
                <div className="font-medium text-gray-900">Email Preview</div>
                <div className="text-gray-500 text-xs mt-1">Generated HTML</div>
              </div>
              <div className="p-6">
                <div
                  className="prose prose-lg max-w-none text-gray-900"
                  dangerouslySetInnerHTML={{ __html: previewHtml }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">HTML Code</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <pre className="text-sm text-gray-700 overflow-x-auto">
                  <code>{previewHtml}</code>
                </pre>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsPreviewOpen(false)}
            >
              Close
            </Button>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(previewHtml)
                // You could add a toast notification here
              }}
            >
              Copy HTML
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 