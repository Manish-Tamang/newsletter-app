"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, AlertCircle, Mail, Settings, Key, Globe } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("")
  const [fromEmail, setFromEmail] = useState("newsletter@manishtamang.com")
  const [replyToEmail, setReplyToEmail] = useState("support@manishtamang.com")
  const [apiStatus, setApiStatus] = useState<"checking" | "connected" | "error" | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Check API status on component mount
  useEffect(() => {
    checkApiStatus()
  }, [])

  const checkApiStatus = async () => {
    setApiStatus("checking")
    try {
      const response = await fetch("/api/email/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: "test@example.com",
          subject: "API Test",
          content: "<p>Testing API connectivity...</p>",
        }),
      })

      if (response.ok) {
        setApiStatus("connected")
      } else {
        setApiStatus("error")
      }
    } catch (error) {
      setApiStatus("error")
    }
  }

  const handleSaveSettings = async () => {
    setIsLoading(true)
    
    // In a real app, you would save these settings to your database
    // For now, we'll just simulate saving
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast({
      title: "Settings saved",
      description: "Your email settings have been updated successfully.",
    })
    
    setIsLoading(false)
  }

  const getApiStatusBadge = () => {
    switch (apiStatus) {
      case "checking":
        return <Badge variant="secondary">Checking...</Badge>
      case "connected":
        return <Badge variant="default" className="bg-green-100 text-green-800">Connected</Badge>
      case "error":
        return <Badge variant="destructive">Error</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Configure your newsletter application settings</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Key className="h-5 w-5 text-gray-600" />
                <CardTitle>API Configuration</CardTitle>
              </div>
              <CardDescription>Configure your Resend.com API settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apiKey">Resend API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="re_123456789..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Get your API key from{" "}
                  <a
                    href="https://resend.com/api-keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Resend.com
                  </a>
                </p>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">API Status</span>
                {getApiStatusBadge()}
              </div>

              <Button
                variant="outline"
                onClick={checkApiStatus}
                disabled={apiStatus === "checking"}
              >
                {apiStatus === "checking" ? "Checking..." : "Test Connection"}
              </Button>

              {apiStatus === "error" && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Unable to connect to Resend API. Please check your API key and try again.
                  </AlertDescription>
                </Alert>
              )}

              {apiStatus === "connected" && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Successfully connected to Resend API. You can now send emails.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-gray-600" />
                <CardTitle>Email Settings</CardTitle>
              </div>
              <CardDescription>Configure your email sending preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fromEmail">From Email Address</Label>
                <Input
                  id="fromEmail"
                  type="email"
                  placeholder="newsletter@manishtamang.com"
                  value={fromEmail}
                  onChange={(e) => setFromEmail(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  This email will appear as the sender of your newsletters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="replyToEmail">Reply-To Email Address</Label>
                <Input
                  id="replyToEmail"
                  type="email"
                  placeholder="support@manishtamang.com"
                  value={replyToEmail}
                  onChange={(e) => setReplyToEmail(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Replies to your emails will be sent to this address
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-gray-600" />
                <CardTitle>General Settings</CardTitle>
              </div>
              <CardDescription>Configure general application settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications about campaign performance
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-save Drafts</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically save campaign drafts
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Analytics Tracking</Label>
                  <p className="text-sm text-muted-foreground">
                    Track email opens and clicks
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-gray-600" />
                <CardTitle>Domain Settings</CardTitle>
              </div>
              <CardDescription>Configure your sending domain</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Domain Status</Label>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Not configured</Badge>
                  <span className="text-sm text-muted-foreground">
                    Configure your domain in Resend dashboard
                  </span>
                </div>
              </div>

              <Button variant="outline" className="w-full">
                Configure Domain
              </Button>

              <p className="text-sm text-muted-foreground">
                Configure your domain in the{" "}
                <a
                  href="https://resend.com/domains"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Resend dashboard
                </a>{" "}
                to improve deliverability.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  )
}
