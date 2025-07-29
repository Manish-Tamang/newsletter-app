"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Send, TestTube } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { RichTextEditor } from "@/components/rich-text-editor"

export default function NewCampaignPage() {
  const [title, setTitle] = useState("")
  const [subject, setSubject] = useState("")
  const [content, setContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSendTest = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
    alert("Test email sent!")
  }

  const handleSendCampaign = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    alert("Campaign sent successfully!")
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

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
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

          <Card className="border-gray-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">Email Content</CardTitle>
              <CardDescription className="text-gray-600">
                Create your newsletter content with our rich text editor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <RichTextEditor
                  value={content}
                  onChange={setContent}
                  placeholder="Write your newsletter content here..."
                />
                <p className="text-sm text-gray-500">
                  Use the toolbar above to format your content. Variables like {"{{name}}"} will be replaced
                  automatically.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
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
                <span className="text-sm font-medium text-gray-900">2,847 subscribers</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Created</span>
                <span className="text-sm text-gray-500">Just now</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Word Count</span>
                <span className="text-sm text-gray-500">
                  {
                    getPlainTextContent(content)
                      .split(" ")
                      .filter((word) => word.length > 0).length
                  }{" "}
                  words
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">Actions</CardTitle>
              <CardDescription className="text-gray-600">Test and send your campaign</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 bg-transparent"
                onClick={handleSendTest}
                disabled={isLoading || !title || !subject || !content}
              >
                <TestTube className="mr-2 h-4 w-4" />
                Send Test Email
              </Button>
              <Button
                className="w-full bg-gray-900 text-white hover:bg-gray-800"
                onClick={handleSendCampaign}
                disabled={isLoading || !title || !subject || !content}
              >
                <Send className="mr-2 h-4 w-4" />
                {isLoading ? "Sending..." : "Send Campaign"}
              </Button>
              <p className="text-xs text-gray-500">This will send the campaign to all 2,847 active subscribers</p>
            </CardContent>
          </Card>

          <Card className="border-gray-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">Preview</CardTitle>
              <CardDescription className="text-gray-600">How your email will look</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border border-gray-200 rounded-lg bg-white">
                <div className="border-b border-gray-100 p-4">
                  <div className="font-medium text-gray-900">{subject || "Email Subject"}</div>
                  <div className="text-gray-500 text-xs mt-1">from newsletter@yoursite.com</div>
                </div>
                <div className="p-4">
                  {content ? (
                    <div
                      className="prose prose-sm max-w-none text-gray-900"
                      dangerouslySetInnerHTML={{ __html: content }}
                    />
                  ) : (
                    <p className="text-gray-500 italic">Your email content will appear here...</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
