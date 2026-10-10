"use client"

import { useCallback, useEffect, useRef, type ClipboardEvent, type FormEvent, type KeyboardEvent } from "react"

type EditableMode = "html" | "text" | "singleline"

interface UseEditableOptions {
  value: string
  onChange: (value: string) => void
  mode?: EditableMode
}

export function useEditable<T extends HTMLElement = HTMLDivElement>({ value, onChange, mode = "html" }: UseEditableOptions) {
  const ref = useRef<T>(null)
  const lastEmittedRef = useRef<string | null>(null)

  const read = useCallback(
    (el: T) => (mode === "html" ? el.innerHTML : el.innerText),
    [mode]
  )

  useEffect(() => {
    if (mode === "html") {
      try {
        document.execCommand("defaultParagraphSeparator", false, "p")
      } catch {}
    }
    const el = ref.current
    if (!el) return
    if (lastEmittedRef.current === value) return
    const current = read(el)
    if (current === value) {
      lastEmittedRef.current = value
      return
    }
    if (mode === "html") el.innerHTML = value
    else el.innerText = value
    lastEmittedRef.current = value
    if (document.activeElement === el) placeCaretAtEnd(el)
  }, [value, mode, read])

  const onInput = useCallback(
    (event: FormEvent<T>) => {
      const el = event.currentTarget
      let next = read(el)
      if (mode === "html" && isEffectivelyEmpty(el)) {
        el.innerHTML = ""
        next = ""
      }
      lastEmittedRef.current = next
      onChange(next)
    },
    [mode, onChange, read]
  )

  const onPaste = useCallback(
    (event: ClipboardEvent<T>) => {
      event.preventDefault()
      let text = event.clipboardData.getData("text/plain")
      if (mode === "singleline") text = text.replace(/\s*\n+\s*/g, " ")
      document.execCommand("insertText", false, text)
    },
    [mode]
  )

  const onKeyDown = useCallback(
    (event: KeyboardEvent<T>) => {
      if (mode === "singleline" && event.key === "Enter") {
        event.preventDefault()
        event.currentTarget.blur()
      }
    },
    [mode]
  )

  return {
    ref,
    props: {
      contentEditable: true,
      suppressContentEditableWarning: true,
      "data-rich": mode === "html" ? "true" : undefined,
      onInput,
      onPaste,
      onKeyDown,
      spellCheck: true,
    },
  }
}

function isEffectivelyEmpty(el: HTMLElement): boolean {
  if (el.querySelector("img, hr")) return false
  const text = el.textContent?.replace(/\u200b/g, "").trim() ?? ""
  if (text) return false
  const html = el.innerHTML.trim()
  return html === "" || html === "<br>" || html === "<div><br></div>" || html === "<p><br></p>"
}

function placeCaretAtEnd(el: HTMLElement) {
  const selection = window.getSelection()
  if (!selection) return
  const range = document.createRange()
  range.selectNodeContents(el)
  range.collapse(false)
  selection.removeAllRanges()
  selection.addRange(range)
}
