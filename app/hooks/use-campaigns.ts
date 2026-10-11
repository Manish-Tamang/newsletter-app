"use client"

import { useState, useEffect } from "react"
import { useToast } from "./use-toast"

export interface Campaign {
  id: number
  title: string
  subject: string
  content: string
  status: "draft" | "sent" | "scheduled"
  sentDate: string | null
  openRate: number | null
  clickRate: number | null
  subscribers: number | null
  fromEmail: string
  createdAt: string
  updatedAt: string
}

export interface CreateCampaignData {
  title: string
  subject: string
  content: string
  fromEmail: string
}

export function useCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchCampaigns = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/campaigns")
      if (!response.ok) {
        throw new Error("Failed to fetch campaigns")
      }
      const data = await response.json()
      setCampaigns(data.campaigns || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch campaigns")
      toast({
        title: "Error",
        description: "Failed to fetch campaigns",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const createCampaign = async (campaignData: CreateCampaignData) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/campaigns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(campaignData),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create campaign")
      }
      
      const data = await response.json()
      setCampaigns(prev => [...prev, data.campaign])
      toast({
        title: "Success",
        description: "Campaign created successfully",
      })
      return data.campaign
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create campaign"
      setError(message)
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      })
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateCampaign = async (id: number, campaignData: Partial<Campaign>) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/campaigns/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(campaignData),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update campaign")
      }
      
      const data = await response.json()
      setCampaigns(prev => prev.map(c => c.id === id ? data.campaign : c))
      toast({
        title: "Success",
        description: "Campaign updated successfully",
      })
      return data.campaign
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update campaign"
      setError(message)
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      })
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteCampaign = async (id: number) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/campaigns/${id}`, {
        method: "DELETE",
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete campaign")
      }
      
      setCampaigns(prev => prev.filter(c => c.id !== id))
      toast({
        title: "Success",
        description: "Campaign deleted successfully",
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete campaign"
      setError(message)
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      })
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getCampaign = async (id: number) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/campaigns/${id}`)
      if (!response.ok) {
        throw new Error("Failed to fetch campaign")
      }
      const data = await response.json()
      return data.campaign
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch campaign"
      setError(message)
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      })
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCampaigns()
  }, [])

  return {
    campaigns,
    loading,
    error,
    fetchCampaigns,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    getCampaign,
  }
} 