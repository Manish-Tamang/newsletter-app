"use client"

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react"
import { Button } from "@/components/ui/button"
import { Download, Save, Eye, Maximize2, Minimize2 } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useEmailEditor } from "@/hooks/use-email-editor"
import { loadSavedDesign, saveDesignToLocalStorage as persistToStorage } from "@/lib/email-editor-storage"
import { isValidEmailHtml } from "@/lib/email-content"

export interface EmailBuilderHandle {
  exportHtml: () => Promise<string | null>
}

interface EmailBuilderProps {
  onSave?: (html: string, design: unknown) => void
  onExportToHtml?: (html: string) => void
  onContentChange?: (html: string) => void
  initialDesign?: unknown
  className?: string
  storageKey?: string
}

export const EmailBuilder = forwardRef<EmailBuilderHandle, EmailBuilderProps>(function EmailBuilder(
  {
    onSave,
    onExportToHtml,
    onContentChange,
    initialDesign,
    className,
    storageKey = "email-builder-design",
  },
  ref
) {
  const { EmailEditorComponent, emailEditorRef } = useEmailEditor()
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [previewHtml, setPreviewHtml] = useState("")
  const [isExporting, setIsExporting] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState("")
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const latestHtmlRef = useRef("")

  const notifyParent = useCallback(
    (html: string, design: unknown) => {
      if (!isValidEmailHtml(html)) return
      latestHtmlRef.current = html
      onContentChange?.(html)
      onSave?.(html, design)
    },
    [onContentChange, onSave]
  )

  const persist = useCallback(
    (html: string, design: unknown) => {
      setIsSaving(true)
      try {
        persistToStorage(storageKey, html, design, setSaveStatus)
      } finally {
        setIsSaving(false)
      }
    },
    [storageKey]
  )

  const exportHtmlFromEditor = useCallback((): Promise<string | null> => {
    return new Promise((resolve) => {
      const unlayer = emailEditorRef.current?.editor
      if (!unlayer) {
        resolve(latestHtmlRef.current || loadSavedDesign(storageKey)?.html || null)
        return
      }

      unlayer.exportHtml((data: { html?: string; design?: unknown }) => {
        const html = data?.html?.trim() || ""
        if (!isValidEmailHtml(html)) {
          resolve(latestHtmlRef.current || loadSavedDesign(storageKey)?.html || null)
          return
        }

        latestHtmlRef.current = html
        persist(html, data.design ?? null)
        notifyParent(html, data.design ?? null)
        resolve(html)
      })
    })
  }, [emailEditorRef, notifyParent, persist, storageKey])

  useImperativeHandle(ref, () => ({
    exportHtml: exportHtmlFromEditor,
  }))

  const scheduleAutoSave = useCallback(() => {
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current)
    autoSaveTimerRef.current = setTimeout(() => {
      void exportHtmlFromEditor()
    }, 800)
  }, [exportHtmlFromEditor])

  useEffect(() => {
    if (!EmailEditorComponent || !emailEditorRef.current) return
    const fn = () => {
      const saved = loadSavedDesign(storageKey)
      const unlayer = emailEditorRef.current?.editor
      if (!saved || !unlayer) return
      if (saved.design) unlayer.loadDesign(saved.design)
      else if (saved.html) unlayer.loadHTML(saved.html)
      if (saved.html) {
        latestHtmlRef.current = saved.html
        notifyParent(saved.html, saved.design)
      }
    }
    const timer = setTimeout(fn, 1000)
    return () => clearTimeout(timer)
  }, [EmailEditorComponent, storageKey, notifyParent, emailEditorRef])

  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current)
    }
  }, [])

  const openPreview = async () => {
    setIsExporting(true)
    const html = await exportHtmlFromEditor()
    setIsExporting(false)
    if (html) {
      setPreviewHtml(html)
      setIsPreviewOpen(true)
    }
  }

  const saveDesign = async () => {
    const unlayer = emailEditorRef.current?.editor
    if (!unlayer) return
    setIsSaving(true)
    await exportHtmlFromEditor()
    setIsSaving(false)
  }

  const onReady = (unlayer: { addEventListener: (event: string, cb: () => void) => void; loadDesign: (design: unknown) => void; exportHtml: (cb: (data: { html?: string; design?: unknown }) => void) => void }) => {
    setTimeout(() => {
      if (!unlayer) return

      if (initialDesign) {
        unlayer.loadDesign(initialDesign)
      }

      unlayer.addEventListener("design:updated", () => {
        setSaveStatus("Auto-saving...")
        scheduleAutoSave()
      })

      void exportHtmlFromEditor()
    }, 1000)
  }

  return (
    <div className={className}>
      <div className={isFullscreen ? "fixed inset-4 z-50 bg-white border rounded-lg shadow-lg" : "border rounded-lg bg-white"}>
        <div className={`p-4 border-b ${isFullscreen ? "" : ""}`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Email Editor</h3>
              <p className="text-sm text-gray-600 mt-1">
                Drag and drop elements to create your email. Changes auto-save and export to HTML.
              </p>
              {saveStatus && (
                <p className="text-xs text-gray-500 mt-1">{saveStatus}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="flex items-center gap-2"
              >
                {isFullscreen ? (
                  <>
                    <Minimize2 className="h-4 w-4" />
                    Exit Fullscreen
                  </>
                ) : (
                  <>
                    <Maximize2 className="h-4 w-4" />
                    Fullscreen
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={openPreview}
                disabled={isExporting || !EmailEditorComponent}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Preview
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={saveDesign}
                disabled={isSaving || !EmailEditorComponent}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {isSaving ? "Saving..." : "Save"}
              </Button>
              <Button
                size="sm"
                onClick={openPreview}
                disabled={isExporting || !EmailEditorComponent}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                {isExporting ? "Exporting..." : "Export HTML"}
              </Button>
            </div>
          </div>
        </div>
        <div>
          {EmailEditorComponent ? (
            <EmailEditorComponent
              ref={emailEditorRef}
              onLoad={() => {}}
              onReady={onReady}
              onDesignLoad={() => {}}
              onDesignSave={() => {
                void exportHtmlFromEditor()
              }}
              options={{
                displayMode: "email",
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
              apiKey="7jnfeJ7C8UgmeA9pjTzuh5P2Bf3smZoz16GZ7CNV9KIMB7nUCvslNb6ahRHJQ0xd"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading email editor...</p>
              </div>
            </div>
          )}
        </div>
      </div>

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
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(previewHtml)
              }}
            >
              Copy HTML
            </Button>
            <Button
              onClick={() => {
                onExportToHtml?.(previewHtml)
                setIsPreviewOpen(false)
              }}
            >
              Use as Raw HTML
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
})
