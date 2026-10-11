"use client"

import { useMemo } from "react"
import { useSubscribers } from "@/hooks/use-subscribers"
import { useCampaigns } from "@/hooks/use-campaigns"

export function useDashboardMetrics() {
  const { contacts } = useSubscribers()
  const { campaigns } = useCampaigns()

  const totalSubscribers = contacts.length
  const campaignsSent = useMemo(() => campaigns.filter((c) => c.status === "sent").length, [campaigns])

  const recentCampaigns = useMemo(
    () =>
      [...campaigns]
        .sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime())
        .slice(0, 3)
        .map((c) => ({
          id: c.id,
          title: c.title,
          date: c.sentDate || c.updatedAt || c.createdAt,
          status: c.status,
          openRate: c.openRate,
        })),
    [campaigns]
  )

  return { totalSubscribers, campaignsSent, recentCampaigns }
}


