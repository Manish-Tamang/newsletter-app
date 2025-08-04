"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Send, TestTube, AlertCircle, Code, Type, Eye, X, Save, Rocket, FileText, Archive } from "lucide-react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
    <div className="max-w-6xl mx-auto py-8 px-6">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" size="sm" asChild className="text-gray-600 hover:text-black p-0 mb-4">
          <Link href="/campaigns">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Campaigns
          </Link>
        </Button>
        <h1 className="text-3xl font-medium tracking-tight">New campaign</h1>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
            <Button variant="link" size="sm" onClick={clearError} className="p-0 h-auto">
              Dismiss
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Tabs */}
      <Tabs defaultValue="campaign" className="space-y-8">
        <TabsList className="grid w-full grid-cols-3 max-w-md bg-transparent p-0 h-auto">
          <TabsTrigger
            value="campaign"
            className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-lg data-[state=active]:border-blue-500 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 bg-white"
          >
            <Rocket className="h-4 w-4" />
            Campaign
          </TabsTrigger>
          <TabsTrigger
            value="content"
            className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-lg data-[state=active]:border-blue-500 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 bg-white ml-2"
          >
            <FileText className="h-4 w-4" />
            Content
          </TabsTrigger>
          <TabsTrigger
            value="archive"
            className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-lg data-[state=active]:border-blue-500 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 bg-white ml-2"
          >
            <Archive className="h-4 w-4" />
            Archive
          </TabsTrigger>
        </TabsList>

        <TabsContent value="campaign" className="mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Campaign Form */}
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Name
                </Label>
                <Input
                  id="name"
                  placeholder="Manish Tamang"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="border-gray-200 focus:border-gray-300 focus:ring-1 focus:ring-gray-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject" className="text-sm font-medium text-gray-700">
                  Subject
                </Label>
                <Input
                  id="subject"
                  placeholder="Hello Test Email"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="border-gray-200 focus:border-gray-300 focus:ring-1 focus:ring-gray-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fromAddress" className="text-sm font-medium text-gray-700">
                  From address
                </Label>
                <Input
                  id="fromAddress"
                  value="newsletter@manishtamang.com"
                  disabled
                  className="border-gray-200 focus:border-gray-300 focus:ring-1 focus:ring-gray-200 bg-gray-50"
                />
              </div>

              <div className="space-y-4">
                <Label className="text-sm font-medium text-gray-700">Lists</Label>

                {/* Selected Lists */}
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1"
                  >
                    Default list
                    <button className="ml-2 hover:text-blue-900">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                </div>

                {/* Add New List */}
                <Input
                  placeholder="Lists to send to"
                  className="border-gray-200 focus:border-gray-300 focus:ring-1 focus:ring-gray-200"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Format</Label>
                <select className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:border-gray-300 focus:ring-1 focus:ring-gray-200">
                  <option value="rich-text">Rich text</option>
                  <option value="html">HTML</option>
                  <option value="plain-text">Plain text</option>
                </select>
              </div>

              <Button
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg"
                onClick={handleSendCampaign}
                disabled={isLoading || !title || !subject || !getFinalContent() || activeSubscriberEmails.length === 0}
              >
                Continue
              </Button>
            </div>

            {/* Right Column - Send Test Message */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <h3 className="font-medium text-gray-900">Send test message</h3>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">E-mails</Label>
                  <Input
                    placeholder="Enter email addresses"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    className="border-gray-200 focus:border-gray-300 focus:ring-1 focus:ring-gray-200"
                  />
                  <p className="text-xs text-gray-500">Hit Enter after typing an address to add multiple recipients.</p>
                </div>

                <Button
                  onClick={handleSendTest}
                  disabled={isLoading || !testEmail || !subject || !getFinalContent()}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white"
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="content" className="mt-8">
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider">EMAIL CONTENT</h2>
                <p className="text-gray-600 mt-2">
                  {useRawHtml ? "Write your HTML email content" : "Create your newsletter content"}
                </p>
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

            <div className="border border-gray-200 rounded-lg">
              <div className="h-[600px] w-full">
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
            </div>
          </div>
        </TabsContent>

        <TabsContent value="archive" className="mt-8">
          <div className="text-center py-12">
            <Archive className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Archive Settings</h3>
            <p className="text-gray-600">Configure archiving options</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
