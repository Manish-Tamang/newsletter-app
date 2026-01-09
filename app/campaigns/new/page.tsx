"use client"

import { useRef, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Archive } from "lucide-react"
import { useEmail } from "@/hooks/use-email"
import { useSubscribers } from "@/hooks/use-subscribers"
import { useToast } from "@/hooks/use-toast"
import { useCampaigns } from "@/hooks/use-campaigns"
import { useCampaignContent } from "@/hooks/use-campaign-content"
import { NewCampaignHeader } from "@/components/campaigns/NewCampaignHeader"
import { CampaignErrorAlert } from "@/components/campaigns/CampaignErrorAlert"
import { CampaignForm } from "@/components/campaigns/CampaignForm"
import { TestEmailPanel } from "@/components/campaigns/TestEmailPanel"
import { ContentEditor, type ContentEditorHandle } from "@/components/campaigns/ContentEditor"
import { SettingsPanel } from "@/components/campaigns/SettingsPanel"
import { MdCampaign } from "react-icons/md"

export default function NewCampaignPage() {
  const { sendTestEmail, sendCampaign, isLoading, error, clearError } = useEmail()
  const { contacts } = useSubscribers()
  const { createCampaign } = useCampaigns()
  const { toast } = useToast()
  const contentEditorRef = useRef<ContentEditorHandle>(null)

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
    getFinalContent,
    refreshContentFromEditor,
  } = useCampaignContent()

  const [testEmail, setTestEmail] = useState("")

  const resolveContentForSend = async () => {
    return refreshContentFromEditor(() => contentEditorRef.current?.exportLatestHtml() ?? Promise.resolve(null))
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

    const emailContent = await resolveContentForSend()

    if (!subject || !emailContent) {
      toast({
        title: "Error",
        description: "Please build your email in the builder before sending a test",
        variant: "destructive",
      })
      return
    }

    const result = await sendTestEmail(testEmail, subject, emailContent)

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
    const emailContent = await resolveContentForSend()

    if (!title || !subject || !emailContent) {
      toast({
        title: "Error",
        description: "Please fill in campaign details and build your email content",
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
      await createCampaign({
        title,
        subject,
        content: emailContent,
        fromEmail: "newsletter@manishtamang.com",
      })

      const result = await sendCampaign({
        title,
        subject,
        content: emailContent,
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
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to send campaign",
          variant: "destructive",
        })
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to create or send campaign",
        variant: "destructive",
      })
    }
  }

  const currentPreview = getFinalContent()

  return (
    <div className="max-w-4xl mx-auto space-y-16 py-8 px-6">
      <NewCampaignHeader
        onSend={handleSendCampaign}
        disabled={isLoading || !title || !subject || !currentPreview || contacts.filter((c) => !c.unsubscribed).length === 0}
        recipientsReady={contacts.filter((c) => !c.unsubscribed).length}
      />

      <CampaignErrorAlert error={error || undefined} onClear={clearError} />

      <div className="space-y-8">
        <div>
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider">CREATE EMAIL</h2>
          <p className="text-gray-600 mt-2">Build your newsletter from scratch using the visual builder. No template required.</p>
        </div>

        <Tabs defaultValue="content" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 max-w-md bg-transparent p-0 h-auto">
            <TabsTrigger
              value="content"
              className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-lg data-[state=active]:border-black data-[state=active]:bg-black data-[state=active]:text-white bg-white"
            >
              <FileText className="h-4 w-4" />
              Builder
            </TabsTrigger>
            <TabsTrigger
              value="campaign"
              className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-lg data-[state=active]:border-black data-[state=active]:bg-black data-[state=active]:text-white bg-white ml-2"
            >
              <MdCampaign className="h-6 w-6" />
              Send
            </TabsTrigger>
            <TabsTrigger
              value="archive"
              className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-lg data-[state=active]:border-black data-[state=active]:bg-black data-[state=active]:text-white bg-white ml-2"
            >
              <Archive className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="mt-8">
            <ContentEditor
              ref={contentEditorRef}
              useRawHtml={useRawHtml}
              setUseRawHtml={setUseRawHtml}
              rawHtml={rawHtml}
              setRawHtml={setRawHtml}
              onContentChange={(html) => setContent(html)}
              subject={subject}
              previewHtml={currentPreview}
            />
          </TabsContent>

          <TabsContent value="campaign" className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <CampaignForm
                  title={title}
                  setTitle={setTitle}
                  subject={subject}
                  setSubject={setSubject}
                />
              </div>
              <div>
                <TestEmailPanel
                  testEmail={testEmail}
                  setTestEmail={setTestEmail}
                  disabled={isLoading || !testEmail || !subject}
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

          <TabsContent value="archive" className="mt-8">
            <SettingsPanel />
          </TabsContent>
        </Tabs>
      </div>

      <div className="pt-8 border-t border-gray-100">
        <div className="text-sm text-gray-500">
          Auto-saved:{" "}
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
