"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowUpRight, CheckCircle, AlertCircle, Mail, Settings, Key, Globe } from "lucide-react"
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
    <div className="max-w-4xl mx-auto space-y-16 py-8 px-6">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-4xl font-medium tracking-tight">Settings</h1>
        <p className="text-lg text-gray-600 max-w-2xl">
          Configure your newsletter application settings, email delivery, and privacy options to optimize your
          campaigns.
        </p>

        <div className="flex items-center gap-4 pt-4">
          <Button 
            onClick={handleSaveSettings} 
            disabled={isLoading}
            className="bg-black text-white hover:bg-gray-800 rounded-full px-6"
          >
            {isLoading ? "Saving..." : "Save Settings"}
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">
              {apiStatus === "connected" ? "All systems operational" : "Checking status..."}
            </span>
          </div>
        </div>
      </div>

      {/* API Configuration */}
      <div className="space-y-8">
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider">API CONFIGURATION</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="apiKey" className="text-sm font-medium">
                Resend API Key
              </Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="re_123456789..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="border-0 bg-gray-50 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <p className="text-sm text-gray-500">
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
              className="rounded-full"
            >
              {apiStatus === "checking" ? "Checking..." : "Test Connection"}
            </Button>
          </div>

          <div className="space-y-6">
            {apiStatus === "error" && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Unable to connect to Resend API. Please check your API key and try again.
                </AlertDescription>
              </Alert>
            )}

            {apiStatus === "connected" && (
              <div className="p-6 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="font-medium text-green-900">API Connection Active</div>
                    <div className="text-sm text-green-700">Successfully connected to Resend API</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Email Configuration */}
      <div className="space-y-8">
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider">EMAIL CONFIGURATION</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fromEmail" className="text-sm font-medium">
                From Email Address
              </Label>
              <Input
                id="fromEmail"
                type="email"
                placeholder="newsletter@manishtamang.com"
                value={fromEmail}
                onChange={(e) => setFromEmail(e.target.value)}
                className="border-0 bg-gray-50 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <p className="text-sm text-gray-500">
                This email will appear as the sender of your newsletters
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="replyToEmail" className="text-sm font-medium">
                Reply-To Email Address
              </Label>
              <Input
                id="replyToEmail"
                type="email"
                placeholder="support@manishtamang.com"
                value={replyToEmail}
                onChange={(e) => setReplyToEmail(e.target.value)}
                className="border-0 bg-gray-50 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <p className="text-sm text-gray-500">Where replies will be sent</p>
            </div>
          </div>
        </div>
      </div>

      {/* General Settings */}
      <div className="space-y-8">
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider">GENERAL SETTINGS</h2>

        <div className="space-y-8">
          <div className="flex items-center justify-between py-4">
            <div className="space-y-1">
              <div className="font-medium">Email Notifications</div>
              <div className="text-sm text-gray-500">Receive notifications about campaign performance</div>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between py-4">
            <div className="space-y-1">
              <div className="font-medium">Auto-save Drafts</div>
              <div className="text-sm text-gray-500">Automatically save campaign drafts</div>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between py-4">
            <div className="space-y-1">
              <div className="font-medium">Analytics Tracking</div>
              <div className="text-sm text-gray-500">Track email opens and clicks</div>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </div>

      {/* Domain Settings */}
      <div className="space-y-8">
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider">DOMAIN SETTINGS</h2>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Domain Status</Label>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Not configured</Badge>
              <span className="text-sm text-gray-500">
                Configure your domain in Resend dashboard
              </span>
            </div>
          </div>

          <Button variant="outline" className="rounded-full">
            Configure Domain
          </Button>

          <p className="text-sm text-gray-500">
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
        </div>
      </div>

      {/* Footer */}
      <div className="pt-8 border-t border-gray-100">
        <div className="text-sm text-gray-500">
          Last updated:{" "}
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
