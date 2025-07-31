"use client"

import { useState, useEffect } from "react"
import { useToast } from "./use-toast"

export interface Template {
  id: string
  name: string
  description: string
  category: string
  content: string
  htmlContent?: string
  isHtml: boolean
  createdAt: string
  updatedAt: string
  usage: number
}

export function useTemplates() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchTemplates = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/templates")
      if (!response.ok) {
        throw new Error("Failed to fetch templates")
      }
      const data = await response.json()
      setTemplates(data.templates || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch templates")
      toast({
        title: "Error",
        description: "Failed to fetch templates",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const createTemplate = async (templateData: Omit<Template, "id" | "createdAt" | "updatedAt" | "usage">) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/templates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(templateData),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create template")
      }
      
      const data = await response.json()
      setTemplates(prev => [...prev, data.template])
      toast({
        title: "Success",
        description: "Template created successfully",
      })
      return data.template
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create template"
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

  const updateTemplate = async (id: string, templateData: Partial<Template>) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/templates/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(templateData),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update template")
      }
      
      const data = await response.json()
      setTemplates(prev => prev.map(t => t.id === id ? data.template : t))
      toast({
        title: "Success",
        description: "Template updated successfully",
      })
      return data.template
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update template"
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

  const deleteTemplate = async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/templates/${id}`, {
        method: "DELETE",
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete template")
      }
      
      setTemplates(prev => prev.filter(t => t.id !== id))
      toast({
        title: "Success",
        description: "Template deleted successfully",
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete template"
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

  const getTemplate = async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/templates/${id}`)
      if (!response.ok) {
        throw new Error("Failed to fetch template")
      }
      const data = await response.json()
      return data.template
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch template"
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
    fetchTemplates()
  }, [])

  return {
    templates,
    loading,
    error,
    fetchTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    getTemplate,
  }
} 