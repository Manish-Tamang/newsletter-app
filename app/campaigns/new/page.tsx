"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Send, TestTube, AlertCircle, Code, Type, Eye, X, Save } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { EmailBuilder } from "@/components/EmailBuilder"
import { HtmlCodeEditor } from "@/components/html-code-editor"
import { useEmail } from "@/hooks/use-email"
import { useSubscribers } from "@/hooks/use-subscribers"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useTemplates } from "@/hooks/use-templates"
import { useCampaigns } from "@/hooks/use-campaigns"

export default function NewCampaignPage() {
  const [title, setTitle] = useState("")
  const [subject, setSubject] = useState("")
  const [content, setContent] = useState("")
  const [rawHtml, setRawHtml] = useState("")
  const [useRawHtml, setUseRawHtml] = useState(false)
  const [testEmail, setTestEmail] = useState("")
  const [showFullPreview, setShowFullPreview] = useState(false)
  
  // Function to handle exporting HTML from EmailBuilder to Raw HTML editor
  const handleExportToHtml = (html: string) => {
    setRawHtml(html)
    setUseRawHtml(true)
    setContent(html) // Also update the content state
  }
  const { sendTestEmail, sendCampaign, isLoading, error, clearError } = useEmail()
  const { contacts, isLoading: isLoadingSubscribers } = useSubscribers()
  const { templates, loading: loadingTemplates } = useTemplates()
  const { createCampaign } = useCampaigns()
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("")
  const { toast } = useToast()

  // When a template is selected, fill the editor
  useEffect(() => {
    if (!selectedTemplateId) return
    const template = templates.find(t => t.id.toString() === selectedTemplateId)
    if (!template) return
    setSubject(template.name)
    if (template.isHtml) {
      setUseRawHtml(true)
      setRawHtml(template.htmlContent || template.content)
      setContent("")
    } else {
      setUseRawHtml(false)
      setContent(template.content)
      setRawHtml("")
    }
  }, [selectedTemplateId, templates])

  // Get active subscriber emails
  const activeSubscriberEmails = contacts
    .filter(contact => !contact.unsubscribed)
    .map(contact => contact.email)

  // Get the final content based on editor mode
  const getFinalContent = () => {
    return useRawHtml ? rawHtml : content
  }

  const handleSendTest = async () => {
    if (!testEmail) {
      toast({
        title: "Error",
        description: "Please enter a test email address",
        variant: "destructive",
      })
      return
    }

    if (!subject || !getFinalContent()) {
      toast({
        title: "Error",
        description: "Please fill in subject and content before sending test",
        variant: "destructive",
      })
      return
    }

    const result = await sendTestEmail(testEmail, subject, getFinalContent())
    
    if (result.success) {
      toast({
        title: "Success",
        description: "Test email sent successfully!",
      })
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to send test email",
        variant: "destructive",
      })
    }
  }

  const handleSendCampaign = async () => {
    if (!title || !subject || !getFinalContent()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    if (activeSubscriberEmails.length === 0) {
      toast({
        title: "Error",
        description: "No active subscribers found. Please add subscribers first.",
        variant: "destructive",
      })
      return
    }

    try {
      // First, save the campaign to the database
      const savedCampaign = await createCampaign({
        title,
        subject,
        content: getFinalContent(),
        fromEmail: "newsletter@manishtamang.com",
      })

      // Then send the campaign
      const result = await sendCampaign({
        title,
        subject,
        content: getFinalContent(),
        subscribers: activeSubscriberEmails,
        fromEmail: "newsletter@manishtamang.com",
      })

      if (result.success) {
        toast({
          title: "Success",
          description: `Campaign sent successfully to ${result.data?.successful || 0} subscribers!`,
        })
        // Reset form after successful send
        setTitle("")
        setSubject("")
        setContent("")
        setRawHtml("")
        setSelectedTemplateId("")
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to send campaign",
          variant: "destructive",
        })
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to create or send campaign",
        variant: "destructive",
      })
    }
  }

  const handleSaveAsDraft = async () => {
    if (!title || !subject || !getFinalContent()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      // Save the campaign to the database as draft
      await createCampaign({
        title,
        subject,
        content: getFinalContent(),
        fromEmail: "newsletter@manishtamang.com",
      })

      toast({
        title: "Success",
        description: "Campaign saved as draft successfully!",
      })
      
      // Reset form after successful save
      setTitle("")
      setSubject("")
      setContent("")
      setRawHtml("")
      setSelectedTemplateId("")
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to save campaign as draft",
        variant: "destructive",
      })
    }
  }

  // Strip HTML tags for plain text preview
  const getPlainTextContent = (html: string) => {
    const div = document.createElement("div")
    div.innerHTML = html
    return div.textContent || div.innerText || ""
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild className="text-gray-600 hover:bg-gray-50 hover:text-gray-900">
          <Link href="/campaigns">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Campaigns
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">New Campaign</h1>
          <p className="text-gray-600">Create and send a new newsletter campaign</p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
            <Button variant="link" size="sm" onClick={clearError} className="p-0 h-auto">
              Dismiss
            </Button>
          </AlertDescription>
        </Alert>
      )}

             <div className="space-y-6">
         {/* Top Section - Two Columns */}
         <div className="grid gap-6 lg:grid-cols-2">
           {/* Left Column - Template Selection and Campaign Details */}
           <div className="space-y-6">
             {/* Template Selection */}
             <Card className="border-gray-200 bg-white">
               <CardHeader>
                 <CardTitle className="text-gray-900">Select Template</CardTitle>
                 <CardDescription className="text-gray-600">Choose a template to start from (optional)</CardDescription>
               </CardHeader>
               <CardContent>
                 <select
                   className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-200 bg-white"
                   value={selectedTemplateId}
                   onChange={e => setSelectedTemplateId(e.target.value)}
                   disabled={loadingTemplates || templates.length === 0}
                 >
                   <option value="">-- No template --</option>
                   {templates.map(t => (
                     <option key={t.id} value={t.id}>
                       {t.name} {t.isHtml ? "(HTML)" : "(Rich Text)"}
                     </option>
                   ))}
                 </select>
               </CardContent>
             </Card>

             {/* Campaign Details */}
             <Card className="border-gray-200 bg-white shadow-sm">
               <CardHeader>
                 <CardTitle className="text-gray-900">Campaign Details</CardTitle>
                 <CardDescription className="text-gray-600">Set up your campaign title and email subject</CardDescription>
               </CardHeader>
               <CardContent className="space-y-4">
                 <div className="space-y-2">
                   <Label htmlFor="title" className="text-gray-700">
                     Campaign Title
                   </Label>
                   <Input
                     id="title"
                     placeholder="e.g., Weekly Newsletter #48"
                     value={title}
                     onChange={(e) => setTitle(e.target.value)}
                     className="border-gray-200 focus:border-gray-300 focus:ring-1 focus:ring-gray-200"
                   />
                   <p className="text-sm text-gray-500">This is for your internal reference only</p>
                 </div>
                 <div className="space-y-2">
                   <Label htmlFor="subject" className="text-gray-700">
                     Email Subject
                   </Label>
                   <Input
                     id="subject"
                     placeholder="e.g., This week's updates and insights"
                     value={subject}
                     onChange={(e) => setSubject(e.target.value)}
                     className="border-gray-200 focus:border-gray-300 focus:ring-1 focus:ring-gray-200"
                   />
                   <p className="text-sm text-gray-500">This will be the subject line of your email</p>
                 </div>
               </CardContent>
             </Card>
           </div>
           <div className="space-y-6">
             <Card className="border-gray-200 bg-white shadow-sm">
               <CardHeader>
                 <CardTitle className="text-gray-900">Test Email</CardTitle>
                 <CardDescription className="text-gray-600">Send a test email before sending to all subscribers</CardDescription>
               </CardHeader>
               <CardContent className="space-y-3">
                 <div className="space-y-2">
                   <Label htmlFor="testEmail" className="text-sm text-gray-700">
                     Test Email Address
                   </Label>
                   <Input
                     id="testEmail"
                     type="email"
                     placeholder="Enter email address for testing"
                     value={testEmail}
                     onChange={(e) => setTestEmail(e.target.value)}
                     className="border-gray-200 focus:border-gray-300 focus:ring-1 focus:ring-gray-200"
                   />
                 </div>
                 <Button
                   variant="outline"
                   className="w-full border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 bg-transparent"
                   onClick={handleSendTest}
                   disabled={isLoading || !testEmail || !subject || !getFinalContent()}
                 >
                   <TestTube className="mr-2 h-4 w-4" />
                   {isLoading ? "Sending..." : "Send Test Email"}
                 </Button>
               </CardContent>
             </Card>
             <Card className="border-gray-200 bg-white shadow-sm">
               <CardHeader>
                 <CardTitle className="text-gray-900">Campaign Status</CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                 <div className="flex items-center justify-between">
                   <span className="text-sm text-gray-700">Status</span>
                   <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                     Draft
                   </Badge>
                 </div>
                 <div className="flex items-center justify-between">
                   <span className="text-sm text-gray-700">Recipients</span>
                   <span className="text-sm font-medium text-gray-900">
                     {isLoadingSubscribers ? "Loading..." : `${activeSubscriberEmails.length} subscribers`}
                   </span>
                 </div>
                 <div className="flex items-center justify-between">
                   <span className="text-sm text-gray-700">Created</span>
                   <span className="text-sm text-gray-500">Just now</span>
                 </div>
                 <div className="flex items-center justify-between">
                   <span className="text-sm text-gray-700">Word Count</span>
                   <span className="text-sm text-gray-500">
                     {
                       getPlainTextContent(getFinalContent())
                         .split(" ")
                         .filter((word) => word.length > 0).length
                     }{" "}
                     words
                   </span>
                 </div>
                 <div className="flex items-center justify-between">
                   <span className="text-sm text-gray-700">Editor Mode</span>
                   <Badge variant="outline" className="text-xs">
                     {useRawHtml ? "Raw HTML" : "Rich Text"}
                   </Badge>
                 </div>
               </CardContent>
             </Card>

             {/* Actions */}
             <Card className="border-gray-200 bg-white shadow-sm">
               <CardHeader>
                 <CardTitle className="text-gray-900">Actions</CardTitle>
                 <CardDescription className="text-gray-600">Test and send your campaign</CardDescription>
               </CardHeader>
               <CardContent className="space-y-3">
                 <Button
                   className="w-full bg-gray-900 text-white hover:bg-gray-800"
                   onClick={handleSendCampaign}
                   disabled={isLoading || !title || !subject || !getFinalContent() || activeSubscriberEmails.length === 0}
                 >
                   <Send className="mr-2 h-4 w-4" />
                   {isLoading ? "Sending..." : "Send Campaign"}
                 </Button>
                 <Button
                   className="w-full border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 bg-transparent"
                   onClick={handleSaveAsDraft}
                   disabled={isLoading || !title || !subject || !getFinalContent()}
                 >
                   <Save className="mr-2 h-4 w-4" />
                   {isLoading ? "Saving..." : "Save as Draft"}
                 </Button>
                 <p className="text-xs text-gray-500">
                   {activeSubscriberEmails.length === 0 
                     ? "No active subscribers found. Add subscribers first."
                     : `This will send the campaign to all ${activeSubscriberEmails.length} active subscribers`
                   }
                 </p>
               </CardContent>
             </Card>
           </div>
         </div>

         {/* Email Content - Full Width */}
         <Card className="border-gray-200 bg-white shadow-sm">
           <CardHeader>
             <div className="flex items-center justify-between">
               <div>
                 <CardTitle className="text-gray-900">Email Content</CardTitle>
                 <CardDescription className="text-gray-600">
                   {useRawHtml ? "Write your HTML email content" : "Create your newsletter content with our drag-and-drop editor"}
                 </CardDescription>
               </div>
               <div className="flex items-center space-x-2">
                 <Type className="h-4 w-4 text-gray-500" />
                 <span className="text-sm text-gray-600">Rich Text</span>
                 <Switch
                   checked={useRawHtml}
                   onCheckedChange={setUseRawHtml}
                 />
                 <Code className="h-4 w-4 text-gray-500" />
                 <span className="text-sm text-gray-600">Raw HTML</span>
               </div>
             </div>
           </CardHeader>
           <div className="h-[580px] w-full">
             {useRawHtml ? (
               <HtmlCodeEditor
                 value={rawHtml}
                 onChange={setRawHtml}
                 placeholder="<html><body><h1>Your HTML content here...</h1></body></html>"
               />
             ) : (
               <EmailBuilder
                 onSave={(html) => setContent(html)}
                 onExportToHtml={handleExportToHtml}
                 className="w-full h-full"
               />
             )}
           </div>
         </Card>
      </div>
    </div>
  )
}
