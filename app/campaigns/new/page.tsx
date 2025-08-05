"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, X, Zap, FileText, Archive, ArrowUpRight, Send, TestTube, AlertCircle, Code, Type, Eye, Save, Rocket } from "lucide-react"
import { EmailBuilder } from "@/components/EmailBuilder"
import { HtmlCodeEditor } from "@/components/html-code-editor"
import { useEmail } from "@/hooks/use-email"
import { useSubscribers } from "@/hooks/use-subscribers"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
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
    <div className="max-w-4xl mx-auto space-y-16 py-8 px-6">
      {/* Header */}
      <div className="space-y-4">
        <Button variant="ghost" size="sm" asChild className="text-gray-600 hover:text-black p-0">
          <Link href="/campaigns">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Campaigns
          </Link>
        </Button>

        <h1 className="text-4xl font-medium tracking-tight">New Campaign</h1>
        <p className="text-lg text-gray-600 max-w-2xl">
          Create and send a new newsletter campaign to your subscribers. Design your content and track performance
          metrics.
        </p>

        <div className="flex items-center gap-4 pt-4">
          <Button
            onClick={handleSendCampaign}
            disabled={isLoading || !title || !subject || !getFinalContent() || activeSubscriberEmails.length === 0}
            className="bg-black text-white hover:bg-gray-800 rounded-full px-6"
          >
            {isLoading ? "Sending..." : "Send Campaign"}
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">{activeSubscriberEmails.length} recipients ready</span>
          </div>
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

      {/* Tabs */}
      <div className="space-y-8">
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider">CAMPAIGN SETUP</h2>

        <Tabs defaultValue="campaign" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 max-w-md bg-transparent p-0 h-auto">
            <TabsTrigger
              value="campaign"
              className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-lg data-[state=active]:border-black data-[state=active]:bg-black data-[state=active]:text-white bg-white"
            >
              <Zap className="h-4 w-4" />
              Campaign
            </TabsTrigger>
            <TabsTrigger
              value="content"
              className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-lg data-[state=active]:border-black data-[state=active]:bg-black data-[state=active]:text-white bg-white ml-2"
            >
              <FileText className="h-4 w-4" />
              Content
            </TabsTrigger>
            <TabsTrigger
              value="archive"
              className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-lg data-[state=active]:border-black data-[state=active]:bg-black data-[state=active]:text-white bg-white ml-2"
            >
              <Archive className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="campaign" className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Left Column - Campaign Form */}
              <div className="lg:col-span-2 space-y-8">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Campaign Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="e.g., Weekly Newsletter #48"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border-0 bg-gray-50 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  <p className="text-sm text-gray-500">Internal reference name</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-sm font-medium">
                    Email Subject
                  </Label>
                  <Input
                    id="subject"
                    placeholder="e.g., This week's updates and insights"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="border-0 bg-gray-50 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  <p className="text-sm text-gray-500">What subscribers will see</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fromAddress" className="text-sm font-medium">
                    From Address
                  </Label>
                  <Input
                    id="fromAddress"
                    value="newsletter@manishtamang.com"
                    disabled
                    className="border-0 bg-gray-50 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  <p className="text-sm text-gray-500">Sender email address</p>
                </div>

                <div className="space-y-4">
                  <Label className="text-sm font-medium">Subscriber Lists</Label>

                  {/* Selected Lists */}
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant="secondary"
                      className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1"
                    >
                      Default list
                      <button className="ml-2 hover:text-gray-900">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  </div>

                  {/* Add New List */}
                  <Input
                    placeholder="Add subscriber list..."
                    className="border-0 bg-gray-50 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  <p className="text-sm text-gray-500">Press Enter to add a list</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Email Format</Label>
                  <Select defaultValue="rich-text">
                    <SelectTrigger className="border-0 bg-gray-50 focus-visible:ring-0 focus-visible:ring-offset-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rich-text">Rich text</SelectItem>
                      <SelectItem value="html">HTML</SelectItem>
                      <SelectItem value="plain-text">Plain text</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Right Column - Send Test Message */}
              <div className="space-y-8">
                <div className="space-y-6">
                  <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">TEST EMAIL</h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Test Recipients</Label>
                      <Input
                        placeholder="Enter email addresses"
                        value={testEmail}
                        onChange={(e) => setTestEmail(e.target.value)}
                        className="border-0 bg-gray-50 focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                      <p className="text-xs text-gray-500">Press Enter to add multiple recipients</p>
                    </div>

                    <Button
                      onClick={handleSendTest}
                      disabled={isLoading || !testEmail || !subject || !getFinalContent()}
                      className="w-full bg-gray-900 hover:bg-gray-800 text-white"
                    >
                      Send Test Email
                    </Button>
                  </div>
                </div>

                <div className="pt-8 border-t border-gray-100">
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Campaign Status</div>
                    <div className="text-sm text-gray-500">Draft - Not sent</div>
                  </div>
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

              {/* Preview */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">PREVIEW</h3>

                <div className="max-w-2xl">
                  <div className="border border-gray-200 rounded-lg bg-white">
                    <div className="border-b border-gray-100 p-6">
                      <div className="font-medium text-lg">{subject || "Email Subject"}</div>
                      <div className="text-gray-500 text-sm mt-1">from newsletter@manishtamang.com</div>
                    </div>
                    <div className="p-6">
                      {getFinalContent() ? (
                        <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: getFinalContent() }} />
                      ) : (
                        <p className="text-gray-500 italic">Your email content will appear here...</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="archive" className="mt-8">
            <div className="space-y-8">
              <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider">CAMPAIGN SETTINGS</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Campaign Priority</Label>
                    <Select defaultValue="normal">
                      <SelectTrigger className="border-0 bg-gray-50 focus-visible:ring-0 focus-visible:ring-offset-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Tracking</Label>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Track opens</span>
                        <input type="checkbox" defaultChecked className="rounded" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Track clicks</span>
                        <input type="checkbox" defaultChecked className="rounded" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Schedule</Label>
                    <Select defaultValue="now">
                      <SelectTrigger className="border-0 bg-gray-50 focus-visible:ring-0 focus-visible:ring-offset-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="now">Send now</SelectItem>
                        <SelectItem value="schedule">Schedule for later</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Tags</Label>
                    <Input
                      placeholder="Add tags (comma separated)"
                      className="border-0 bg-gray-50 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <p className="text-sm text-gray-500">Help organize your campaigns</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <div className="pt-8 border-t border-gray-100">
        <div className="text-sm text-gray-500">
          Draft saved:{" "}
          {new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            timeZoneName: "short",
          })}
        </div>
      </div>
    </div>
  )
}
