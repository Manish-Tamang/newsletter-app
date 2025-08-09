"use client"

import { TrendingUp } from "lucide-react"

interface Props {
  totalSubscribers: number
  campaignsSent: number
}

export function OverviewCards({ totalSubscribers, campaignsSent }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      <div className="space-y-2">
        <div className="text-3xl font-medium">{totalSubscribers.toLocaleString()}</div>
        <div className="text-gray-600">Total Subscribers</div>
        <div className="flex items-center gap-1 text-sm">
          <TrendingUp className="h-3 w-3 text-green-600" />
          <span className="text-green-600">+12%</span>
          <span className="text-gray-500">this month</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-3xl font-medium">{campaignsSent}</div>
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
  )
}


