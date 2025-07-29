"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Save, Key, Mail, Globe, Shield } from "lucide-react"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    siteName: "Newsletter App",
    siteUrl: "https://newsletter.example.com",
    fromName: "Newsletter Team",
    fromEmail: "newsletter@example.com",
    replyToEmail: "support@example.com",
    smtpHost: "smtp.example.com",
    smtpPort: "587",
    smtpUsername: "newsletter@example.com",
    smtpPassword: "••••••••",
    enableDoubleOptIn: true,
    enableUnsubscribeLink: true,
    trackOpens: true,
    trackClicks: true,
  })

  const handleSave = () => {
    console.log("Saving settings:", settings)
    alert("Settings saved successfully!")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Settings</h1>
        <p className="text-gray-600">Configure your newsletter application</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-gray-100 border-gray-200">
          <TabsTrigger
            value="general"
            className="flex items-center gap-2 text-gray-600 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
          >
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">General</span>
          </TabsTrigger>
          <TabsTrigger
            value="email"
            className="flex items-center gap-2 text-gray-600 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
          >
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">Email</span>
          </TabsTrigger>
          <TabsTrigger
            value="smtp"
            className="flex items-center gap-2 text-gray-600 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
          >
            <Key className="h-4 w-4" />
            <span className="hidden sm:inline">SMTP</span>
          </TabsTrigger>
          <TabsTrigger
            value="privacy"
            className="flex items-center gap-2 text-gray-600 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
          >
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Privacy</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card className="border-gray-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">General Settings</CardTitle>
              <CardDescription className="text-gray-600">
                Basic configuration for your newsletter application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="siteName" className="text-gray-700">
                    Site Name
                  </Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                    className="border-gray-200 focus:border-gray-300 focus:ring-1 focus:ring-gray-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteUrl" className="text-gray-700">
                    Site URL
                  </Label>
                  <Input
                    id="siteUrl"
                    value={settings.siteUrl}
                    onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
                    className="border-gray-200 focus:border-gray-300 focus:ring-1 focus:ring-gray-200"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-6">
          <Card className="border-gray-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">Email Configuration</CardTitle>
              <CardDescription className="text-gray-600">
                Configure how your emails appear to subscribers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fromName" className="text-gray-700">
                    From Name
                  </Label>
                  <Input
                    id="fromName"
                    value={settings.fromName}
                    onChange={(e) => setSettings({ ...settings, fromName: e.target.value })}
                    className="border-gray-200 focus:border-gray-300 focus:ring-1 focus:ring-gray-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fromEmail" className="text-gray-700">
                    From Email
                  </Label>
                  <Input
                    id="fromEmail"
                    type="email"
                    value={settings.fromEmail}
                    onChange={(e) => setSettings({ ...settings, fromEmail: e.target.value })}
                    className="border-gray-200 focus:border-gray-300 focus:ring-1 focus:ring-gray-200"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="replyToEmail" className="text-gray-700">
                  Reply-To Email
                </Label>
                <Input
                  id="replyToEmail"
                  type="email"
                  value={settings.replyToEmail}
                  onChange={(e) => setSettings({ ...settings, replyToEmail: e.target.value })}
                  className="border-gray-200 focus:border-gray-300 focus:ring-1 focus:ring-gray-200"
                />
                <p className="text-sm text-gray-500">Replies to your newsletters will be sent to this address</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="smtp" className="space-y-6">
          <Card className="border-gray-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">SMTP Configuration</CardTitle>
              <CardDescription className="text-gray-600">Configure your SMTP server for sending emails</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost" className="text-gray-700">
                    SMTP Host
                  </Label>
                  <Input
                    id="smtpHost"
                    value={settings.smtpHost}
                    onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })}
                    className="border-gray-200 focus:border-gray-300 focus:ring-1 focus:ring-gray-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPort" className="text-gray-700">
                    SMTP Port
                  </Label>
                  <Input
                    id="smtpPort"
                    value={settings.smtpPort}
                    onChange={(e) => setSettings({ ...settings, smtpPort: e.target.value })}
                    className="border-gray-200 focus:border-gray-300 focus:ring-1 focus:ring-gray-200"
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="smtpUsername" className="text-gray-700">
                    Username
                  </Label>
                  <Input
                    id="smtpUsername"
                    value={settings.smtpUsername}
                    onChange={(e) => setSettings({ ...settings, smtpUsername: e.target.value })}
                    className="border-gray-200 focus:border-gray-300 focus:ring-1 focus:ring-gray-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPassword" className="text-gray-700">
                    Password
                  </Label>
                  <Input
                    id="smtpPassword"
                    type="password"
                    value={settings.smtpPassword}
                    onChange={(e) => setSettings({ ...settings, smtpPassword: e.target.value })}
                    className="border-gray-200 focus:border-gray-300 focus:ring-1 focus:ring-gray-200"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="text-blue-600">
                  <Key className="h-5 w-5" />
                </div>
                <div className="text-sm">
                  <p className="font-medium text-blue-900">SMTP Status</p>
                  <p className="text-blue-700">
                    <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                      Connected
                    </Badge>{" "}
                    Last tested 2 hours ago
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card className="border-gray-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">Privacy & Tracking</CardTitle>
              <CardDescription className="text-gray-600">
                Configure privacy settings and tracking options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-gray-700">Double Opt-in</Label>
                  <p className="text-sm text-gray-500">Require subscribers to confirm their email address</p>
                </div>
                <Switch
                  checked={settings.enableDoubleOptIn}
                  onCheckedChange={(checked) => setSettings({ ...settings, enableDoubleOptIn: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-gray-700">Unsubscribe Link</Label>
                  <p className="text-sm text-gray-500">Automatically add unsubscribe links to emails</p>
                </div>
                <Switch
                  checked={settings.enableUnsubscribeLink}
                  onCheckedChange={(checked) => setSettings({ ...settings, enableUnsubscribeLink: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-gray-700">Track Opens</Label>
                  <p className="text-sm text-gray-500">Track when subscribers open your emails</p>
                </div>
                <Switch
                  checked={settings.trackOpens}
                  onCheckedChange={(checked) => setSettings({ ...settings, trackOpens: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-gray-700">Track Clicks</Label>
                  <p className="text-sm text-gray-500">Track when subscribers click links in your emails</p>
                </div>
                <Switch
                  checked={settings.trackClicks}
                  onCheckedChange={(checked) => setSettings({ ...settings, trackClicks: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-gray-900 text-white hover:bg-gray-800">
          <Save className="mr-2 h-4 w-4" />
          Save Settings
        </Button>
      </div>
    </div>
  )
}
