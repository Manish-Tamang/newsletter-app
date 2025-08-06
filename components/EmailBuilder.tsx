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
  campaignId?: string
  templateId?: string
  autoSave?: boolean
}

export function EmailBuilder({ 
  onSave, 
  onExportToHtml, 
  initialDesign, 
  className,
  campaignId,
  templateId,
  autoSave = true
}: EmailBuilderProps) {
  const emailEditorRef = useRef<any>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [previewHtml, setPreviewHtml] = useState("")
  const [isExporting, setIsExporting] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [EmailEditorComponent, setEmailEditorComponent] = useState<any>(null)
  const [lastSavedDesign, setLastSavedDesign] = useState<any>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<string>("")
  const [tempTemplateId, setTempTemplateId] = useState<string>("")

  // Generate a temporary template ID for saving designs when no campaignId is provided
  useEffect(() => {
    if (!campaignId && !templateId && !tempTemplateId) {
      setTempTemplateId(`temp_${Date.now()}`)
    }
  }, [campaignId, templateId, tempTemplateId])

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

  // Load saved design on component mount
  useEffect(() => {
    if (!EmailEditorComponent || !emailEditorRef.current) return

    const loadSavedDesign = async () => {
      try {
        const params = new URLSearchParams()
        if (campaignId) params.append("campaignId", campaignId)
        if (templateId) params.append("templateId", templateId)
        if (tempTemplateId && !campaignId && !templateId) params.append("templateId", tempTemplateId)

        if (!params.toString()) return

        const response = await fetch(`/api/email/save-design?${params.toString()}`)
        const data = await response.json()

        if (data.success && data.content) {
          const unlayer = emailEditorRef.current?.editor
          if (unlayer) {
            // For now, only load HTML content since design JSON is not supported yet
            unlayer.loadHTML(data.content)
            console.log("Loaded saved HTML content from server")
          }
        }
      } catch (error) {
        console.error("Failed to load saved design:", error)
      }
    }

    loadSavedDesign()
  }, [EmailEditorComponent, campaignId, templateId, tempTemplateId])

  const saveDesignToServer = async (html: string, design: any) => {
    try {
      setIsSaving(true)
      setSaveStatus("Saving...")

      // Use tempTemplateId if no campaignId or templateId is provided
      const effectiveTemplateId = templateId || (tempTemplateId && !campaignId ? tempTemplateId : null)

      console.log("Saving design to server:", { 
        html: html?.substring(0, 100), 
        design: design ? "present" : "null", 
        campaignId, 
        templateId: effectiveTemplateId 
      })

      const response = await fetch("/api/email/save-design", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          design,
          html,
          campaignId,
          templateId: effectiveTemplateId,
        }),
      })

      const data = await response.json()
      console.log("Server response:", data)

      if (data.success) {
        setLastSavedDesign(design)
        setSaveStatus("Saved")
        setTimeout(() => setSaveStatus(""), 2000)
        console.log("Design saved to server:", data.message)
        
        // Update tempTemplateId with the actual template ID from server
        if (data.templateId && tempTemplateId) {
          setTempTemplateId(data.templateId.toString())
        }
      } else {
        setSaveStatus("Save failed")
        console.error("Failed to save design:", data.error)
      }
    } catch (error) {
      setSaveStatus("Save failed")
      console.error("Error saving design:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const exportHtml = () => {
    const unlayer = emailEditorRef.current?.editor;
    if (!unlayer) return;
  
    setIsExporting(true);
  
    unlayer.exportHtml((data: any) => {
      if (data?.html) {
        setPreviewHtml(data.html);
        setIsPreviewOpen(true);
        setIsExporting(false);
        
        // Save to server when exporting
        saveDesignToServer(data.html, data.design);
        
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
  
          if (html) {
            // Save to server
            saveDesignToServer(html, design);
            
            if (onSave) {
              onSave(html, design);
            }
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
                // Only save when explicitly requested, not automatically
                // saveDesignToServer(html, null)
              }
            })
          })
        }
        
        unlayer.exportHtml((data: any) => {
          const { html } = data
          console.log("Initial HTML content:", html)
          if (onSave && html && html.length > 0 && !html.includes('missing-container')) {
            onSave(html, null)
            // Only save when explicitly requested, not automatically
            // saveDesignToServer(html, null)
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
    // Only save when explicitly requested, not automatically
    // const unlayer = emailEditorRef.current?.editor
    // if (unlayer) {
    //   unlayer.exportHtml((data: any) => {
    //     const { html } = data
    //     if (onSave) {
    //       onSave(html, null)
    //     }
    //     // Auto-save to server
    //     saveDesignToServer(html, null)
    //   })
    // }
  }

  // Remove the periodic auto-save mechanism
  // useEffect(() => {
  //   if (!EmailEditorComponent || !autoSave) return

  //   const interval = setInterval(() => {
  //     const unlayer = emailEditorRef.current?.editor
  //     if (unlayer) {
  //       unlayer.saveDesign((design: any) => {
  //         if (design && Object.keys(design).length > 0) {
  //           unlayer.exportHtml((data: any) => {
  //             const { html } = data
  //             if (html && html.length > 0 && !html.includes('missing-container')) {
  //               // Auto-save to server every 30 seconds
  //               saveDesignToServer(html, design)
  //             }
  //           })
  //         }
  //       })
  //     }
  //   }, 30000) // Save every 30 seconds

  //   return () => clearInterval(interval)
  // }, [EmailEditorComponent, autoSave])

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
                <span className="text-orange-600 ml-2">Manual save only - click Save button to preserve your work</span>
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
                disabled={isSaving || !EmailEditorComponent}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {isSaving ? "Saving..." : "Save"}
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