"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Zap, FileText, Archive } from "lucide-react"
import { useEmail } from "@/hooks/use-email"
import { useSubscribers } from "@/hooks/use-subscribers"
import { useToast } from "@/hooks/use-toast"
import { useTemplates } from "@/hooks/use-templates"
import { useCampaigns } from "@/hooks/use-campaigns"
import { useCampaignContent } from "@/hooks/use-campaign-content"
import { NewCampaignHeader } from "@/components/campaigns/NewCampaignHeader"
import { CampaignErrorAlert } from "@/components/campaigns/CampaignErrorAlert"
import { CampaignForm } from "@/components/campaigns/CampaignForm"
import { TestEmailPanel } from "@/components/campaigns/TestEmailPanel"
import { ContentEditor } from "@/components/campaigns/ContentEditor"
import { SettingsPanel } from "@/components/campaigns/SettingsPanel"
import { extractPlainTextFromHtml } from "@/lib/email"
import { MdCampaign } from "react-icons/md";

export default function NewCampaignPage() {
  const { sendTestEmail, sendCampaign, isLoading, error, clearError } = useEmail()
  const { contacts } = useSubscribers()
  const { templates } = useTemplates()
  const { createCampaign } = useCampaigns()
  const { toast } = useToast()

  const {
    title,
    setTitle,
    subject,
    setSubject,
    content,
    setContent,
    rawHtml,
    setRawHtml,
    useRawHtml,
    setUseRawHtml,
    selectedTemplateId,
    setSelectedTemplateId,
    handleExportToHtml,
    getFinalContent,
  } = useCampaignContent(templates)

  const [testEmail, setTestEmail] = useState("")

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

    const activeSubscriberEmails = contacts.filter((c) => !c.unsubscribed).map((c) => c.email)
    if (activeSubscriberEmails.length === 0) {
      toast({
        title: "Error",
        description: "No active subscribers found. Please add subscribers first.",
        variant: "destructive",
      })
      return
    }

    try {
      const savedCampaign = await createCampaign({
        title,
        subject,
        content: getFinalContent(),
        fromEmail: "newsletter@manishtamang.com",
      })

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

  return (
    <div className="max-w-4xl mx-auto space-y-16 py-8 px-6">
      <NewCampaignHeader
        onSend={handleSendCampaign}
        disabled={isLoading || !title || !subject || !getFinalContent() || contacts.filter((c) => !c.unsubscribed).length === 0}
        recipientsReady={contacts.filter((c) => !c.unsubscribed).length}
      />

      <CampaignErrorAlert error={error || undefined} onClear={clearError} />

      {/* Tabs */}
      <div className="space-y-8">
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider">CAMPAIGN SETUP</h2>

        <Tabs defaultValue="campaign" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 max-w-md bg-transparent p-0 h-auto">
            <TabsTrigger
              value="campaign"
              className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-lg data-[state=active]:border-black data-[state=active]:bg-black data-[state=active]:text-white bg-white"
            >
              <MdCampaign className="h-6 w-6" />
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
              <div className="lg:col-span-2">
                <CampaignForm title={title} setTitle={setTitle} subject={subject} setSubject={setSubject} />
              </div>
              <div>
                <TestEmailPanel
                  testEmail={testEmail}
                  setTestEmail={setTestEmail}
                  disabled={isLoading || !testEmail || !subject || !getFinalContent()}
                  onSendTest={handleSendTest}
                />
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
            <ContentEditor
              useRawHtml={useRawHtml}
              setUseRawHtml={setUseRawHtml}
              rawHtml={rawHtml}
              setRawHtml={setRawHtml}
              onSaveRich={(html) => setContent(html)}
              onExportToHtml={handleExportToHtml}
              subject={subject}
              previewHtml={getFinalContent()}
            />
          </TabsContent>

          <TabsContent value="archive" className="mt-8">
            <SettingsPanel />
          </TabsContent>
        </Tabs>
      </div>

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
