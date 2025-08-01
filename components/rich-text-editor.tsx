"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Toggle } from "@/components/ui/toggle"
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  LinkIcon,
  ImageIcon,
  Code,
  Code2,
  Undo,
  Redo,
  RotateCcw,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function RichTextEditor({ value, onChange, placeholder = "Write your content here..." }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false)
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [linkText, setLinkText] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [imageAlt, setImageAlt] = useState("")
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize editor content
  useEffect(() => {
    if (editorRef.current && !isInitialized) {
      editorRef.current.innerHTML = value || ""
      setIsInitialized(true)
      // Force focus to ensure editor is active
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.focus()
        }
      }, 100)
    }
  }, [value, isInitialized])

  // Update content when value prop changes (after initialization)
  useEffect(() => {
    if (editorRef.current && isInitialized && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value
    }
  }, [value, isInitialized])

  const updateContent = () => {
    if (editorRef.current && isInitialized) {
      const newContent = editorRef.current.innerHTML
      if (newContent !== value) {
        onChange(newContent)
      }
    }
  }

  const handleContentChange = () => {
    updateContent()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault()
      insertHTML('<br>')
    }
  }

  const handleFocus = () => {
    // Ensure editor is properly focused
    if (editorRef.current) {
      editorRef.current.focus()
    }
  }

  const insertHTML = (html: string) => {
    if (editorRef.current) {
      editorRef.current.focus()
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        const fragment = range.createContextualFragment(html)
        range.deleteContents()
        range.insertNode(fragment)
        range.collapse(false)
        selection.removeAllRanges()
        selection.addRange(range)
      } else {
        // If no selection, append to the end
        editorRef.current.innerHTML += html
      }
      updateContent()
    }
  }

  const formatText = (command: string) => {
    if (editorRef.current) {
      editorRef.current.focus()
      
      switch (command) {
        case 'bold':
          document.execCommand('bold', false)
          break
        case 'italic':
          document.execCommand('italic', false)
          break
        case 'underline':
          document.execCommand('underline', false)
          break
        case 'strikethrough':
          document.execCommand('strikeThrough', false)
          break
        case 'h1':
          document.execCommand('formatBlock', false, '<h1>')
          break
        case 'h2':
          document.execCommand('formatBlock', false, '<h2>')
          break
        case 'h3':
          document.execCommand('formatBlock', false, '<h3>')
          break
        case 'alignLeft':
          document.execCommand('justifyLeft', false)
          break
        case 'alignCenter':
          document.execCommand('justifyCenter', false)
          break
        case 'alignRight':
          document.execCommand('justifyRight', false)
          break
        case 'alignJustify':
          document.execCommand('justifyFull', false)
          break
        case 'unorderedList':
          document.execCommand('insertUnorderedList', false)
          break
        case 'orderedList':
          document.execCommand('insertOrderedList', false)
          break
        case 'blockquote':
          document.execCommand('formatBlock', false, '<blockquote>')
          break
        case 'code':
          insertHTML('<code style="background: #f5f5f5; padding: 2px 4px; border-radius: 3px; font-family: monospace;">code</code>')
          return
        case 'codeBlock':
          insertHTML('<pre style="background: #f5f5f5; padding: 12px; border-radius: 6px; font-family: monospace; overflow-x: auto;"><code>// Your code here</code></pre>')
          return
      }
      updateContent()
    }
  }

  const insertLink = () => {
    if (linkUrl && linkText) {
      insertHTML(`<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkText}</a>`)
      setLinkUrl("")
      setLinkText("")
      setIsLinkDialogOpen(false)
    }
  }

  const insertImage = () => {
    if (imageUrl) {
      insertHTML(`<img src="${imageUrl}" alt="${imageAlt}" style="max-width: 100%; height: auto;" />`)
      setImageUrl("")
      setImageAlt("")
      setIsImageDialogOpen(false)
    }
  }

  const clearFormatting = () => {
    if (editorRef.current) {
      editorRef.current.focus()
      document.execCommand('removeFormat', false)
      document.execCommand('unlink', false)
      updateContent()
    }
  }

  const undo = () => {
    if (editorRef.current) {
      editorRef.current.focus()
      document.execCommand('undo', false)
      updateContent()
    }
  }

  const redo = () => {
    if (editorRef.current) {
      editorRef.current.focus()
      document.execCommand('redo', false)
      updateContent()
    }
  }

  const isFormatActive = (format: string): boolean => {
    if (editorRef.current) {
      editorRef.current.focus()
      return document.queryCommandState(format)
    }
    return false
  }

  return (
    <div className="border border-gray-200 rounded-lg bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-3 border-b border-gray-100 bg-gray-50/50">
        {/* Text Formatting */}
        <div className="flex items-center gap-1">
          <Toggle
            size="sm"
            pressed={isFormatActive("bold")}
            onPressedChange={() => formatText("bold")}
            className="hover:bg-gray-100 data-[state=on]:bg-gray-200"
          >
            <Bold className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={isFormatActive("italic")}
            onPressedChange={() => formatText("italic")}
            className="hover:bg-gray-100 data-[state=on]:bg-gray-200"
          >
            <Italic className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={isFormatActive("underline")}
            onPressedChange={() => formatText("underline")}
            className="hover:bg-gray-100 data-[state=on]:bg-gray-200"
          >
            <Underline className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={isFormatActive("strikeThrough")}
            onPressedChange={() => formatText("strikethrough")}
            className="hover:bg-gray-100 data-[state=on]:bg-gray-200"
          >
            <Strikethrough className="h-4 w-4" />
          </Toggle>
        </div>

        <Separator orientation="vertical" className="h-6 bg-gray-200" />

        {/* Headings */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => formatText("h1")}
            className="hover:bg-gray-100"
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => formatText("h2")}
            className="hover:bg-gray-100"
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => formatText("h3")}
            className="hover:bg-gray-100"
          >
            <Heading3 className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6 bg-gray-200" />

        {/* Lists */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => formatText("unorderedList")}
            className="hover:bg-gray-100"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => formatText("orderedList")}
            className="hover:bg-gray-100"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => formatText("blockquote")}
            className="hover:bg-gray-100"
          >
            <Quote className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6 bg-gray-200" />

        {/* Alignment */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => formatText("alignLeft")} className="hover:bg-gray-100">
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => formatText("alignCenter")}
            className="hover:bg-gray-100"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => formatText("alignRight")}
            className="hover:bg-gray-100"
          >
            <AlignRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => formatText("alignJustify")} className="hover:bg-gray-100">
            <AlignJustify className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6 bg-gray-200" />

        {/* Links and Media */}
        <div className="flex items-center gap-1">
          <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                <LinkIcon className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="border-gray-200">
              <DialogHeader>
                <DialogTitle className="text-gray-900">Insert Link</DialogTitle>
                <DialogDescription className="text-gray-600">Add a hyperlink to your content</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="linkText" className="text-gray-700">
                    Link Text
                  </Label>
                  <Input
                    id="linkText"
                    placeholder="Enter link text"
                    value={linkText}
                    onChange={(e) => setLinkText(e.target.value)}
                    className="border-gray-200 focus:border-gray-300 focus:ring-1 focus:ring-gray-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkUrl" className="text-gray-700">
                    URL
                  </Label>
                  <Input
                    id="linkUrl"
                    placeholder="https://example.com"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    className="border-gray-200 focus:border-gray-300 focus:ring-1 focus:ring-gray-200"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsLinkDialogOpen(false)}
                  className="border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button onClick={insertLink} className="bg-gray-900 text-white hover:bg-gray-800">
                  Insert Link
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                <ImageIcon className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="border-gray-200">
              <DialogHeader>
                <DialogTitle className="text-gray-900">Insert Image</DialogTitle>
                <DialogDescription className="text-gray-600">Add an image to your content</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="imageUrl" className="text-gray-700">
                    Image URL
                  </Label>
                  <Input
                    id="imageUrl"
                    placeholder="https://example.com/image.jpg"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="border-gray-200 focus:border-gray-300 focus:ring-1 focus:ring-gray-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="imageAlt" className="text-gray-700">
                    Alt Text (Optional)
                  </Label>
                  <Input
                    id="imageAlt"
                    placeholder="Describe the image"
                    value={imageAlt}
                    onChange={(e) => setImageAlt(e.target.value)}
                    className="border-gray-200 focus:border-gray-300 focus:ring-1 focus:ring-gray-200"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsImageDialogOpen(false)}
                  className="border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button onClick={insertImage} className="bg-gray-900 text-white hover:bg-gray-800">
                  Insert Image
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Separator orientation="vertical" className="h-6 bg-gray-200" />

        {/* Code */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => formatText("code")}
            className="hover:bg-gray-100"
          >
            <Code className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => formatText("codeBlock")} className="hover:bg-gray-100">
            <Code2 className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6 bg-gray-200" />

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={undo} className="hover:bg-gray-100">
            <Undo className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={redo} className="hover:bg-gray-100">
            <Redo className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={clearFormatting} className="hover:bg-gray-100">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleContentChange}
        onKeyDown={handleKeyDown}
        onBlur={updateContent}
        onFocus={handleFocus}
        className="min-h-[400px] p-4 focus:outline-none prose prose-sm max-w-none"
        style={{
          wordBreak: "break-word",
          direction: "ltr",
          textAlign: "left",
          unicodeBidi: "embed",
        }}
        data-placeholder={placeholder}
      />

      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
        
        [contenteditable] {
          direction: ltr !important;
          text-align: left !important;
          unicode-bidi: embed !important;
        }
        
        [contenteditable] * {
          direction: ltr !important;
          text-align: left !important;
        }
        
        [contenteditable] h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 0.67em 0;
          direction: ltr !important;
          text-align: left !important;
        }
        
        [contenteditable] h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 0.75em 0;
          direction: ltr !important;
          text-align: left !important;
        }
        
        [contenteditable] h3 {
          font-size: 1.17em;
          font-weight: bold;
          margin: 0.83em 0;
          direction: ltr !important;
          text-align: left !important;
        }
        
        [contenteditable] blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 1rem;
          margin: 1rem 0;
          font-style: italic;
          color: #6b7280;
          direction: ltr !important;
          text-align: left !important;
        }
        
        [contenteditable] ul, [contenteditable] ol {
          padding-left: 2rem;
          margin: 1rem 0;
          direction: ltr !important;
          text-align: left !important;
        }
        
        [contenteditable] li {
          margin: 0.5rem 0;
          direction: ltr !important;
          text-align: left !important;
        }
        
        [contenteditable] a {
          color: #3b82f6;
          text-decoration: underline;
          direction: ltr !important;
          text-align: left !important;
        }
        
        [contenteditable] img {
          max-width: 100%;
          height: auto;
          border-radius: 6px;
          margin: 1rem 0;
        }
        
        [contenteditable] code {
          direction: ltr !important;
          text-align: left !important;
          unicode-bidi: embed !important;
        }
        
        [contenteditable] pre {
          direction: ltr !important;
          text-align: left !important;
          unicode-bidi: embed !important;
        }
        
        [contenteditable] p {
          direction: ltr !important;
          text-align: left !important;
          unicode-bidi: embed !important;
        }
        
        [contenteditable] div {
          direction: ltr !important;
          text-align: left !important;
          unicode-bidi: embed !important;
        }
      `}</style>
    </div>
  )
}
