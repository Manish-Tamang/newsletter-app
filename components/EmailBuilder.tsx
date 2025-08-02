"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Download, Save, Eye, Maximize2, Minimize2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface EmailBuilderProps {
  onSave?: (html: string, design: any) => void
  onExportToHtml?: (html: string) => void
  initialDesign?: any
  className?: string
}

export function EmailBuilder({ onSave, onExportToHtml, initialDesign, className }: EmailBuilderProps) {
  const emailEditorRef = useRef<any>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [previewHtml, setPreviewHtml] = useState("")
  const [isExporting, setIsExporting] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [EmailEditorComponent, setEmailEditorComponent] = useState<any>(null)

  useEffect(() => {
    // Dynamically import the EmailEditor component
    const loadEmailEditor = async () => {
      try {
        const { default: EmailEditor } = await import("react-email-editor")
        setEmailEditorComponent(() => EmailEditor)
      } catch (error) {
        console.error("Failed to load email editor:", error)
      }
    }

    loadEmailEditor()
  }, [])
  const exportHtml = () => {
    const unlayer = emailEditorRef.current?.editor;
    if (!unlayer) return;
  
    setIsExporting(true);
  
    unlayer.exportHtml((data: any) => {
      if (data?.html) {
        setPreviewHtml(data.html);
        setIsPreviewOpen(true);
        setIsExporting(false);
        if (onSave) {
          unlayer.saveDesign((design: any) => {
            onSave(data.html, design);
          });
        }
      } else {
        alert("Failed to export HTML");
        setIsExporting(false);
      }
    });
  };
  

  const saveDesign = async () => {
    const unlayer = emailEditorRef.current?.editor;
    if (unlayer) {
      unlayer.saveDesign((design: any) => {
        unlayer.exportHtml((data: any) => {
          const { html } = data;
  
          if (onSave && html) {
            onSave(html, design);
          }
        });
      });
    }
  };
  

  const onLoad = () => {
    console.log("Email editor loaded")
  }

  const onReady = (unlayer: any) => {
    console.log("Email editor ready")
    
    // Wait a bit for the editor to fully initialize
    setTimeout(() => {
      if (unlayer) {
        // Load initial design if provided
        if (initialDesign) {
          unlayer.loadDesign(initialDesign)
        } else {
          // Add a default text block if no initial design
          unlayer.addEventListener('design:updated', () => {
            unlayer.exportHtml((data: any) => {
              const { html } = data
              if (onSave && html && html.length > 0 && !html.includes('missing-container')) {
                onSave(html, null)
              }
            })
          })
        }
        
        unlayer.exportHtml((data: any) => {
          const { html } = data
          console.log("Initial HTML content:", html)
          if (onSave && html && html.length > 0 && !html.includes('missing-container')) {
            onSave(html, null)
          }
        })
      }
    }, 1000)
  }

  const onDesignLoad = (data: any) => {
    console.log("Design loaded", data)
  }

  const onDesignSave = (data: any) => {
    console.log("Design saved", data)
    // Save the content when design changes
    const unlayer = emailEditorRef.current?.editor
    if (unlayer) {
      unlayer.exportHtml((data: any) => {
        const { html } = data
        if (onSave) {
          onSave(html, null)
        }
      })
    }
  }

  // Add a periodic save mechanism
  useEffect(() => {
    if (!EmailEditorComponent) return

    const interval = setInterval(() => {
      const unlayer = emailEditorRef.current?.editor
      if (unlayer) {
        unlayer.saveDesign((design: any) => {
          if (design && Object.keys(design).length > 0) {
                         // Use our API route for periodic saves
             fetch('/api/email/export', {
               method: 'POST',
               headers: {
                 'Content-Type': 'application/json'
               },
               body: JSON.stringify({
                 design: design
               })
             })
                         .then(response => {
               if (!response.ok) {
                 throw new Error(`HTTP error! status: ${response.status}`)
               }
               return response.json()
             })
                           .then(data => {
                if (data.success && data.html && onSave) {
                  onSave(data.html, null)
                }
              })
             .catch(error => {
               console.error("Periodic save error:", error)
             })
          }
        })
      }
    }, 5000) // Save every 5 seconds

    return () => clearInterval(interval)
  }, [EmailEditorComponent, onSave])

  return (
    <div className={className}>
      <div className={isFullscreen ? "fixed inset-4 z-50 bg-white border rounded-lg shadow-lg" : "border rounded-lg bg-white"}>
        {/* Header */}
        <div className={`p-4 border-b ${isFullscreen ? "" : ""}`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Email Editor</h3>
              <p className="text-sm text-gray-600 mt-1">
                Drag and drop elements to create your email template. Use the toolbar on the left to add content blocks.
              </p>
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
                onClick={exportHtml}
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
                disabled={!EmailEditorComponent}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Save
              </Button>
              <Button
                size="sm"
                onClick={exportHtml}
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
              onLoad={onLoad}
              onReady={onReady}
              onDesignLoad={onDesignLoad}
              onDesignSave={onDesignSave}
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
             <Button
               onClick={() => {
                 if (onExportToHtml) {
                   onExportToHtml(previewHtml)
                 }
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
}