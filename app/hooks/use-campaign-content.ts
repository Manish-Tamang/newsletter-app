"use client"

import { useCallback, useEffect, useState } from "react"
import {
  EMAIL_STORAGE_KEYS,
  getNewsletterBlocksHtml,
  loadDraftFromStorage,
  resolveEmailHtml,
  saveDraftToStorage,
} from "@/lib/email-content"

export function useCampaignContent() {
  const [title, setTitle] = useState("")
  const [subject, setSubject] = useState("")
  const [content, setContent] = useState("")
  const [rawHtml, setRawHtml] = useState("")
  const [useRawHtml, setUseRawHtml] = useState(false)

  useEffect(() => {
    const draft = loadDraftFromStorage<{
      title?: string
      subject?: string
      content?: string
      rawHtml?: string
      useRawHtml?: boolean
    }>(EMAIL_STORAGE_KEYS.campaignDraft)

    if (draft) {
      if (draft.title) setTitle(draft.title)
      if (draft.subject) setSubject(draft.subject)
      if (draft.content) setContent(draft.content)
      if (draft.rawHtml) setRawHtml(draft.rawHtml)
      if (typeof draft.useRawHtml === "boolean") setUseRawHtml(draft.useRawHtml)
    }

    const builderHtml = getNewsletterBlocksHtml()
    if (builderHtml && !draft?.content) {
      setContent(builderHtml)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      saveDraftToStorage(EMAIL_STORAGE_KEYS.campaignDraft, {
        title,
        subject,
        content,
        rawHtml,
        useRawHtml,
      })
    }, 1000)

    return () => clearTimeout(timer)
  }, [title, subject, content, rawHtml, useRawHtml])

  const getFinalContent = useCallback(() => {
    return resolveEmailHtml({
      content,
      rawHtml,
      useRawHtml,
    })
  }, [useRawHtml, rawHtml, content])

  const refreshContentFromEditor = useCallback(
    async (exportFn?: () => Promise<string | null>) => {
      if (exportFn) {
        const exported = await exportFn()
        if (exported) {
          setContent(exported)
          if (useRawHtml) setRawHtml(exported)
          return exported
        }
      }

      const resolved = getFinalContent()
      if (resolved && resolved !== content) {
        setContent(resolved)
      }
      return resolved
    },
    [content, getFinalContent, useRawHtml]
  )

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
    getFinalContent,
    refreshContentFromEditor,
  }
}
