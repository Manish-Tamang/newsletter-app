"use client"

import { useCallback, useEffect, useState } from "react"

type Template = {
  id: string | number
  name: string
  content: string
  isHtml?: boolean
  htmlContent?: string | null
}

export function useCampaignContent(templates: Template[] = []) {
  const [title, setTitle] = useState("")
  const [subject, setSubject] = useState("")
  const [content, setContent] = useState("")
  const [rawHtml, setRawHtml] = useState("")
  const [useRawHtml, setUseRawHtml] = useState(false)
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("")

  useEffect(() => {
    if (!selectedTemplateId) return
    const template = templates.find((t) => t.id.toString() === selectedTemplateId)
    if (!template) return
    setSubject(template.name)
    if (template.isHtml) {
      setUseRawHtml(true)
      setRawHtml(template.htmlContent || template.content)
      setContent("")
    } else {
      setUseRawHtml(false)
      setContent(template.content)
      setRawHtml("")
    }
  }, [selectedTemplateId, templates])

  const handleExportToHtml = useCallback((html: string) => {
    setRawHtml(html)
    setUseRawHtml(true)
    setContent(html)
  }, [])

  const getFinalContent = useCallback(() => (useRawHtml ? rawHtml : content), [useRawHtml, rawHtml, content])

  return {
    title,
    setTitle,
    subject,
    setSubject,
    content,
    setContent,
    rawHtml,
    setRawHtml,
    useRawHtml,
    setUseRawHtml,
    selectedTemplateId,
    setSelectedTemplateId,
    handleExportToHtml,
    getFinalContent,
  }
}


