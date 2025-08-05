import { ArrowUpRight, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-16 py-8 px-6">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-4xl font-medium tracking-tight">Dashboard</h1>
        <p className="text-lg text-gray-600 max-w-2xl">
          Welcome back to your newsletter dashboard. Here's an overview of your recent activity and key performance
          metrics.
        </p>

        <div className="flex items-center gap-4 pt-4">
          <Button className="bg-black text-white hover:bg-gray-800 rounded-full px-6">
            Create Campaign
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">All systems operational</span>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="space-y-8">
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider">OVERVIEW</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-2">
            <div className="text-3xl font-medium">2,847</div>
            <div className="text-gray-600">Total Subscribers</div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span className="text-green-600">+12%</span>
              <span className="text-gray-500">this month</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-3xl font-medium">24</div>
            <div className="text-gray-600">Campaigns Sent</div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span className="text-green-600">+3</span>
              <span className="text-gray-500">this month</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-3xl font-medium">24.8%</div>
            <div className="text-gray-600">Average Open Rate</div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span className="text-green-600">+2.1%</span>
              <span className="text-gray-500">this month</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-3xl font-medium">3.2%</div>
            <div className="text-gray-600">Click Rate</div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span className="text-green-600">+0.5%</span>
              <span className="text-gray-500">this month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="space-y-8">
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider">RECENT CAMPAIGNS</h2>

        <div className="space-y-6">
          {[
            { title: "Weekly Newsletter #47", date: "2024-01-15", status: "Sent", openRate: "26.4%" },
            { title: "Product Update: New Features", date: "2024-01-12", status: "Sent", openRate: "31.2%" },
            { title: "Welcome Series - Part 3", date: "2024-01-10", status: "Draft", openRate: null },
          ].map((campaign) => (
            <div key={campaign.title} className="flex items-center justify-between py-4">
              <div className="space-y-1">
                <div className="font-medium">{campaign.title}</div>
                <div className="text-sm text-gray-500">{campaign.date}</div>
              </div>
              <div className="text-right space-y-1">
                <div className="text-sm font-medium">{campaign.status}</div>
                {campaign.openRate && <div className="text-sm text-gray-500">{campaign.openRate} open rate</div>}
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
