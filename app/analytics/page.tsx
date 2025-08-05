"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, TrendingDown, ArrowUpRight } from "lucide-react"
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export default function AnalyticsPage() {
  const emailVolumeData = [
    { month: "Jan", sent: 12400, delivered: 11800 },
    { month: "Feb", sent: 13200, delivered: 12600 },
    { month: "Mar", sent: 14100, delivered: 13400 },
    { month: "Apr", sent: 15300, delivered: 14500 },
    { month: "May", sent: 16800, delivered: 15900 },
    { month: "Jun", sent: 18200, delivered: 17100 },
  ]

  const engagementData = [
    { date: "Jan 1", opens: 24.5, clicks: 3.2 },
    { date: "Jan 8", opens: 26.1, clicks: 3.8 },
    { date: "Jan 15", opens: 28.3, clicks: 4.1 },
    { date: "Jan 22", opens: 25.7, clicks: 3.5 },
    { date: "Jan 29", opens: 29.2, clicks: 4.3 },
    { date: "Feb 5", opens: 31.1, clicks: 4.8 },
  ]

  const deliverabilityData = [
    { name: "Delivered", value: 94.2, color: "#000000" },
    { name: "Bounced", value: 3.8, color: "#666666" },
    { name: "Spam", value: 1.5, color: "#999999" },
    { name: "Rejected", value: 0.5, color: "#cccccc" },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-16 py-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-4xl font-medium tracking-tight">Analytics</h1>
        <p className="text-lg text-gray-600 max-w-2xl">
          Track your email campaign performance and deliverability with comprehensive insights into subscriber
          engagement and delivery metrics.
        </p>

        <div className="flex items-center gap-4 pt-4">
          <Button className="bg-black text-white hover:bg-gray-800 rounded-full px-6">
            Export Report
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Updated 2 minutes ago</span>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="space-y-8">
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider">KEY METRICS</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-2">
            <div className="text-3xl font-medium">89,247</div>
            <div className="text-gray-600">Total Emails Sent</div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span className="text-green-600">+12.3%</span>
              <span className="text-gray-500">from last month</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-3xl font-medium">94.2%</div>
            <div className="text-gray-600">Delivery Rate</div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span className="text-green-600">+0.8%</span>
              <span className="text-gray-500">from last month</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-3xl font-medium">28.4%</div>
            <div className="text-gray-600">Open Rate</div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span className="text-green-600">+2.1%</span>
              <span className="text-gray-500">from last month</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-3xl font-medium">4.2%</div>
            <div className="text-gray-600">Click Rate</div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingDown className="h-3 w-3 text-red-600" />
              <span className="text-red-600">-0.3%</span>
              <span className="text-gray-500">from last month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Email Volume Chart */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider">EMAIL VOLUME</h2>
            <p className="text-gray-600 mt-2">Monthly sending trends and delivery performance</p>
          </div>
          <Select defaultValue="6m">
            <SelectTrigger className="w-32 border-0 bg-gray-50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">1 month</SelectItem>
              <SelectItem value="3m">3 months</SelectItem>
              <SelectItem value="6m">6 months</SelectItem>
              <SelectItem value="1y">1 year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="h-80">
          <ChartContainer
            config={{
              sent: { label: "Sent", color: "#000000" },
              delivered: { label: "Delivered", color: "#666666" },
            }}
            className="h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={emailVolumeData}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} className="text-xs text-gray-500" />
                <YAxis axisLine={false} tickLine={false} className="text-xs text-gray-500" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="sent"
                  stroke="#000000"
                  fill="#000000"
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="delivered"
                  stroke="#666666"
                  fill="#666666"
                  fillOpacity={0.05}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>

      {/* Engagement Trends */}
      <div className="space-y-8">
        <div>
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider">ENGAGEMENT</h2>
          <p className="text-gray-600 mt-2">Open and click rates over time</p>
        </div>

        <div className="h-80">
          <ChartContainer
            config={{
              opens: { label: "Open Rate", color: "#000000" },
              clicks: { label: "Click Rate", color: "#666666" },
            }}
            className="h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={engagementData}>
                <XAxis dataKey="date" axisLine={false} tickLine={false} className="text-xs text-gray-500" />
                <YAxis axisLine={false} tickLine={false} className="text-xs text-gray-500" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="opens"
                  stroke="#000000"
                  strokeWidth={2}
                  dot={{ fill: "#000000", strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6, fill: "#000000" }}
                />
                <Line
                  type="monotone"
                  dataKey="clicks"
                  stroke="#666666"
                  strokeWidth={2}
                  dot={{ fill: "#666666", strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6, fill: "#666666" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>

      {/* Deliverability */}
      <div className="space-y-8">
        <div>
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider">DELIVERABILITY</h2>
          <p className="text-gray-600 mt-2">Email delivery status breakdown</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="h-64">
            <ChartContainer
              config={{
                delivered: { label: "Delivered", color: "#000000" },
                bounced: { label: "Bounced", color: "#666666" },
                spam: { label: "Spam", color: "#999999" },
                rejected: { label: "Rejected", color: "#cccccc" },
              }}
              className="h-full"
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
                          <div className="bg-white p-3 border border-gray-200 rounded-lg">
                            <div className="font-medium">{data.name}</div>
                            <div className="text-2xl font-bold">{data.value}%</div>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          <div className="space-y-6">
            {deliverabilityData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="font-medium">{item.name}</span>
                </div>
                <div className="text-2xl font-medium">{item.value}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Campaigns */}
      <div className="space-y-8">
        <div>
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider">TOP CAMPAIGNS</h2>
          <p className="text-gray-600 mt-2">Best performing campaigns from the last 30 days</p>
        </div>

        <div className="space-y-6">
          {[
            { name: "Weekly Newsletter #47", opens: "26.4%", clicks: "3.2%", revenue: "$1,240" },
            { name: "Product Launch Announcement", opens: "31.2%", clicks: "4.8%", revenue: "$2,180" },
            { name: "Holiday Special Offer", opens: "28.7%", clicks: "5.3%", revenue: "$3,420" },
            { name: "Welcome Series - Part 3", opens: "35.1%", clicks: "6.2%", revenue: "$890" },
          ].map((campaign, index) => (
            <div key={campaign.name} className="flex items-center justify-between py-4">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </div>
                <div className="font-medium">{campaign.name}</div>
              </div>
              <div className="flex items-center gap-8 text-sm">
                <div>
                  <div className="font-medium">{campaign.opens}</div>
                  <div className="text-gray-500">Opens</div>
                </div>
                <div>
                  <div className="font-medium">{campaign.clicks}</div>
                  <div className="text-gray-500">Clicks</div>
                </div>
                <div>
                  <div className="font-medium">{campaign.revenue}</div>
                  <div className="text-gray-500">Revenue</div>
                </div>
              </div>
            </div>
          ))}
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
