import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Mail, TrendingUp, Send } from "lucide-react"

export default function DashboardPage() {
  const stats = [
    {
      title: "Total Subscribers",
      value: "2,847",
      change: "+12%",
      changeType: "positive" as const,
      icon: Users,
    },
    {
      title: "Campaigns Sent",
      value: "24",
      change: "+3",
      changeType: "positive" as const,
      icon: Send,
    },
    {
      title: "Average Open Rate",
      value: "24.8%",
      change: "+2.1%",
      changeType: "positive" as const,
      icon: Mail,
    },
    {
      title: "Click Rate",
      value: "3.2%",
      change: "+0.5%",
      changeType: "positive" as const,
      icon: TrendingUp,
    },
  ]

  const recentCampaigns = [
    {
      id: 1,
      title: "Weekly Newsletter #47",
      status: "sent",
      sentDate: "2024-01-15",
      openRate: "26.4%",
      subscribers: 2847,
    },
    {
      id: 2,
      title: "Product Update: New Features",
      status: "sent",
      sentDate: "2024-01-12",
      openRate: "31.2%",
      subscribers: 2834,
    },
    {
      id: 3,
      title: "Welcome Series - Part 3",
      status: "draft",
      sentDate: null,
      openRate: null,
      subscribers: null,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your newsletter performance</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className={stat.changeType === "positive" ? "text-green-600" : "text-red-600"}>
                  {stat.change}
                </span>{" "}
                from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Recent Campaigns</CardTitle>
          <CardDescription>Your latest newsletter campaigns and their performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentCampaigns.map((campaign) => (
              <div key={campaign.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="space-y-1">
                  <p className="font-medium">{campaign.title}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant={campaign.status === "sent" ? "default" : "secondary"}>{campaign.status}</Badge>
                    {campaign.sentDate && <span>Sent on {new Date(campaign.sentDate).toLocaleDateString()}</span>}
                  </div>
                </div>
                <div className="text-right text-sm">
                  {campaign.openRate && <div className="font-medium">{campaign.openRate} open rate</div>}
                  {campaign.subscribers && (
                    <div className="text-muted-foreground">{campaign.subscribers.toLocaleString()} subscribers</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
