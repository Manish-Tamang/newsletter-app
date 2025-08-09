"use client"

interface RecentCampaign {
  id: number
  title: string
  date: string | null
  status: string
  openRate: number | null | undefined
}

export function RecentCampaigns({ campaigns }: { campaigns: RecentCampaign[] }) {
  return (
    <div className="space-y-6">
      {campaigns.map((campaign) => (
        <div key={campaign.id} className="flex items-center justify-between py-4">
          <div className="space-y-1">
            <div className="font-medium">{campaign.title}</div>
            <div className="text-sm text-gray-500">{campaign.date ? new Date(campaign.date).toLocaleDateString() : "—"}</div>
          </div>
          <div className="text-right space-y-1">
            <div className="text-sm font-medium capitalize">{campaign.status}</div>
            {campaign.openRate != null && <div className="text-sm text-gray-500">{campaign.openRate}% open rate</div>}
          </div>
        </div>
      ))}
    </div>
  )
}


