"use client"

import { useEffect, useRef, useState } from "react"

export function useEmailEditor() {
  const emailEditorRef = useRef<any>(null)
  const [EmailEditorComponent, setEmailEditorComponent] = useState<any>(null)

  useEffect(() => {
    const loadEmailEditor = async () => {
      try {
        const { default: EmailEditor } = await import("react-email-editor")
        setEmailEditorComponent(() => EmailEditor)
      } catch (error) {
        console.error("Failed to load email editor:", error)
      }
    }
    loadEmailEditor()
  }, [])

  return { EmailEditorComponent, emailEditorRef }
}


