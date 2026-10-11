"use client"

import { ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useDashboardMetrics } from "@/hooks/use-dashboard-metrics"
import { OverviewCards } from "@/components/dashboard/OverviewCards"
import { RecentCampaigns } from "@/components/dashboard/RecentCampaigns"

export default function DashboardPage() {
  const { totalSubscribers, campaignsSent, recentCampaigns } = useDashboardMetrics()

  return (
    <div className="max-w-4xl mx-auto space-y-16 py-8 px-6">
      <div className="space-y-4">
        <h1 className="text-4xl font-medium tracking-tight">Dashboard</h1>
        <p className="text-lg text-gray-600 max-w-2xl">Welcome back to your newsletter dashboard. Here's an overview of your recent activity and key performance metrics.</p>
        <div className="flex items-center gap-4 pt-4">
          <Button className="bg-black text-white hover:bg-gray-800 rounded-full px-6">
            Create Campaign
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-sm text-gray-600">All systems operational</span>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider">OVERVIEW</h2>
        <OverviewCards totalSubscribers={totalSubscribers} campaignsSent={campaignsSent} />
      </div>

      <div className="space-y-8">
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider">RECENT CAMPAIGNS</h2>
        <RecentCampaigns campaigns={recentCampaigns} />
      </div>

      <div className="pt-8 border-t border-gray-100">
        <div className="text-sm text-gray-500">
          Last updated:{" "}
          {new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", timeZoneName: "short" })}
        </div>
      </div>
    </div>
  )
}
