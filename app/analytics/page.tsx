"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  TrendingUp,
  TrendingDown,
  Mail,
  MousePointer,
  Eye,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export default function AnalyticsPage() {
  // Sample data for charts
  const emailVolumeData = [
    { month: "Jan", sent: 12400, delivered: 11800, bounced: 600 },
    { month: "Feb", sent: 13200, delivered: 12600, bounced: 600 },
    { month: "Mar", sent: 14100, delivered: 13400, bounced: 700 },
    { month: "Apr", sent: 15300, delivered: 14500, bounced: 800 },
    { month: "May", sent: 16800, delivered: 15900, bounced: 900 },
    { month: "Jun", sent: 18200, delivered: 17100, bounced: 1100 },
  ]

  const engagementData = [
    { date: "Jan 1", opens: 24.5, clicks: 3.2, unsubscribes: 0.8 },
    { date: "Jan 8", opens: 26.1, clicks: 3.8, unsubscribes: 0.6 },
    { date: "Jan 15", opens: 28.3, clicks: 4.1, unsubscribes: 0.9 },
    { date: "Jan 22", opens: 25.7, clicks: 3.5, unsubscribes: 0.7 },
    { date: "Jan 29", opens: 29.2, clicks: 4.3, unsubscribes: 0.5 },
    { date: "Feb 5", opens: 31.1, clicks: 4.8, unsubscribes: 0.8 },
  ]

  const deliverabilityData = [
    { name: "Delivered", value: 94.2, color: "#10b981" },
    { name: "Bounced", value: 3.8, color: "#ef4444" },
    { name: "Spam", value: 1.5, color: "#f59e0b" },
    { name: "Rejected", value: 0.5, color: "#6b7280" },
  ]

  const topCampaigns = [
    { name: "Weekly Newsletter #47", sent: 2847, opens: 26.4, clicks: 3.2, revenue: "$1,240" },
    { name: "Product Launch", sent: 2834, opens: 31.2, clicks: 4.8, revenue: "$2,180" },
    { name: "Holiday Special", sent: 2821, opens: 28.7, clicks: 5.3, revenue: "$3,420" },
    { name: "Welcome Series #3", sent: 1456, opens: 35.1, clicks: 6.2, revenue: "$890" },
  ]

  const stats = [
    {
      title: "Total Emails Sent",
      value: "89,247",
      change: "+12.3%",
      changeType: "positive" as const,
      icon: Mail,
      description: "Last 30 days",
    },
    {
      title: "Delivery Rate",
      value: "94.2%",
      change: "+0.8%",
      changeType: "positive" as const,
      icon: CheckCircle,
      description: "Successfully delivered",
    },
    {
      title: "Open Rate",
      value: "28.4%",
      change: "+2.1%",
      changeType: "positive" as const,
      icon: Eye,
      description: "Average across campaigns",
    },
    {
      title: "Click Rate",
      value: "4.2%",
      change: "-0.3%",
      changeType: "negative" as const,
      icon: MousePointer,
      description: "Click-through rate",
    },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">Track your email campaign performance and deliverability</p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="30d">
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">Export Report</Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                {stat.changeType === "positive" ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                )}
                <span className={stat.changeType === "positive" ? "text-green-600" : "text-red-600"}>
                  {stat.change}
                </span>
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="deliverability">Deliverability</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Email Volume Trend</CardTitle>
                <CardDescription>Monthly email sending volume and delivery rates</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    sent: {
                      label: "Sent",
                      color: "hsl(var(--chart-1))",
                    },
                    delivered: {
                      label: "Delivered",
                      color: "hsl(var(--chart-2))",
                    },
                    bounced: {
                      label: "Bounced",
                      color: "hsl(var(--chart-3))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={emailVolumeData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis className="text-xs" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        type="monotone"
                        dataKey="sent"
                        stackId="1"
                        stroke="var(--color-sent)"
                        fill="var(--color-sent)"
                        fillOpacity={0.6}
                      />
                      <Area
                        type="monotone"
                        dataKey="delivered"
                        stackId="2"
                        stroke="var(--color-delivered)"
                        fill="var(--color-delivered)"
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle>Deliverability Breakdown</CardTitle>
                <CardDescription>Email delivery status distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    delivered: {
                      label: "Delivered",
                      color: "#10b981",
                    },
                    bounced: {
                      label: "Bounced",
                      color: "#ef4444",
                    },
                    spam: {
                      label: "Spam",
                      color: "#f59e0b",
                    },
                    rejected: {
                      label: "Rejected",
                      color: "#6b7280",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={deliverabilityData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {deliverabilityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload
                            return (
                              <div className="rounded-lg border bg-background p-2 shadow-sm">
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="flex flex-col">
                                    <span className="text-[0.70rem] uppercase text-muted-foreground">{data.name}</span>
                                    <span className="font-bold">{data.value}%</span>
                                  </div>
                                </div>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {deliverabilityData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-muted-foreground">{item.name}</span>
                      <span className="text-sm font-medium ml-auto">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Engagement Metrics Over Time</CardTitle>
              <CardDescription>Track open rates, click rates, and unsubscribe rates</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  opens: {
                    label: "Open Rate",
                    color: "hsl(var(--chart-1))",
                  },
                  clicks: {
                    label: "Click Rate",
                    color: "hsl(var(--chart-2))",
                  },
                  unsubscribes: {
                    label: "Unsubscribe Rate",
                    color: "hsl(var(--chart-3))",
                  },
                }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis className="text-xs" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="opens"
                      stroke="var(--color-opens)"
                      strokeWidth={2}
                      dot={{ fill: "var(--color-opens)", strokeWidth: 2, r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="clicks"
                      stroke="var(--color-clicks)"
                      strokeWidth={2}
                      dot={{ fill: "var(--color-clicks)", strokeWidth: 2, r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="unsubscribes"
                      stroke="var(--color-unsubscribes)"
                      strokeWidth={2}
                      dot={{ fill: "var(--color-unsubscribes)", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deliverability" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
                <AlertTriangle className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3.8%</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">-0.2%</span> from last month
                </p>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Hard bounces</span>
                    <span>2.1%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Soft bounces</span>
                    <span>1.7%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Spam Rate</CardTitle>
                <XCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1.5%</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-red-600">+0.1%</span> from last month
                </p>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Gmail</span>
                    <span>0.8%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Outlook</span>
                    <span>0.7%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reputation Score</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">98.2</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+0.5</span> from last month
                </p>
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Sender Score</span>
                    <span>Excellent</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: "98.2%" }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>Delivery Issues</CardTitle>
              <CardDescription>Recent delivery problems and recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 border border-orange-200 rounded-lg bg-orange-50/50">
                  <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-orange-900">High bounce rate detected</h4>
                    <p className="text-sm text-orange-700 mt-1">
                      Your bounce rate increased by 0.8% this week. Consider cleaning your email list.
                    </p>
                    <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                      Clean Email List
                    </Button>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 border border-blue-200 rounded-lg bg-blue-50/50">
                  <Clock className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-blue-900">Optimal send time</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Your emails perform best when sent on Tuesday at 10 AM.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Top Performing Campaigns</CardTitle>
              <CardDescription>Your best campaigns from the last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topCampaigns.map((campaign, index) => (
                  <div
                    key={campaign.name}
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium">{campaign.name}</h4>
                        <p className="text-sm text-muted-foreground">{campaign.sent.toLocaleString()} recipients</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <div className="font-medium">{campaign.opens}%</div>
                        <div className="text-muted-foreground">Opens</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{campaign.clicks}%</div>
                        <div className="text-muted-foreground">Clicks</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{campaign.revenue}</div>
                        <div className="text-muted-foreground">Revenue</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
