"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Zap, Maximize2, Minimize2 } from "lucide-react"
import CodeMirror from '@uiw/react-codemirror'
import { html } from '@codemirror/lang-html'
import { vscodeDark } from '@uiw/codemirror-theme-vscode'
import { useState } from "react"
import { EditorView } from '@codemirror/view'

interface HtmlCodeEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function HtmlCodeEditor({ value, onChange, placeholder, className }: HtmlCodeEditorProps) {
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [originalValue, setOriginalValue] = useState("")
  const [isFormatted, setIsFormatted] = useState(false)

  // Format HTML code
  const formatHtml = (html: string): string => {
    try {
      // Simple HTML formatting
      let formatted = html
        .replace(/></g, '>\n<')
        .replace(/\n\s*\n/g, '\n')
        .replace(/^\s+|\s+$/g, '')
      
      // Add proper indentation
      const lines = formatted.split('\n')
      let indentLevel = 0
      const formattedLines = lines.map(line => {
        const trimmed = line.trim()
        if (trimmed.startsWith('</')) {
          indentLevel = Math.max(0, indentLevel - 1)
        }
        const indented = '  '.repeat(indentLevel) + trimmed
        if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.endsWith('/>')) {
          indentLevel++
        }
        return indented
      })
      
      return formattedLines.join('\n')
    } catch (error) {
      return html
    }
  }

  const handleFormat = () => {
    if (!isFormatted) {
      setOriginalValue(value)
      const formatted = formatHtml(value)
      onChange(formatted)
      setIsFormatted(true)
    } else {
      onChange(originalValue)
      setIsFormatted(false)
    }
  }

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen)
  }

  return (
    <div className={`space-y-2 ${className} ${isFullScreen ? 'fixed inset-0 z-50 bg-white dark:bg-gray-900 p-4' : ''}`}>
      <div className="flex items-center justify-between">
        <Label htmlFor="html-editor" className="text-gray-700 dark:text-gray-300">
          HTML Content
        </Label>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleFormat}
            className={`text-xs transition-all duration-200 ${
              isFormatted 
                ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400' 
                : 'hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
            title={isFormatted ? "Double-click to undo format" : "Format HTML code"}
          >
            <Zap className={`h-3 w-3 ${isFormatted ? 'text-green-600 dark:text-green-400' : ''}`} />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={toggleFullScreen}
            className="text-xs"
            title={isFullScreen ? "Exit full screen" : "Enter full screen"}
          >
            {isFullScreen ? (
              <Minimize2 className="h-3 w-3" />
            ) : (
              <Maximize2 className="h-3 w-3" />
            )}
          </Button>
        </div>
      </div>
      
      <div className={`border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden ${
        isFullScreen ? 'h-[calc(100vh-120px)]' : 'h-full'
      }`}>
        <CodeMirror
          value={value}
          height={isFullScreen ? "calc(100vh - 140px)" : "100%"}
          extensions={[
            html(),
            EditorView.lineWrapping,
            EditorView.theme({
              "&": {
                fontSize: "14px",
              },
              ".cm-line": {
                padding: "0 8px",
                lineHeight: "1.5",
              },
              ".cm-content": {
                fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
              },
            })
          ]}
          onChange={(value) => onChange(value)}
          placeholder={placeholder || "<html><body><h1>Your HTML content here...</h1></body></html>"}
          theme={vscodeDark}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLine: true,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: true,
            defaultKeymap: true,
            searchKeymap: true,
            historyKeymap: true,
            foldKeymap: true,
            completionKeymap: true,
            foldGutter: true,
            dropCursor: true,
            allowMultipleSelections: true,
            indentOnInput: true,
            syntaxHighlighting: true,
            tabSize: 2,
          }}
          style={{ width: '100%' }}
        />
      </div>
      
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Write your complete HTML email template. You can use variables like {"{{name}}"} which will be replaced automatically.
      </p>
    </div>
  )
} 