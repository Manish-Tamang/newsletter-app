"use client"

import { useState, useRef } from "react"
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

  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const handleContentChange = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const insertLink = () => {
    if (linkUrl && linkText) {
      executeCommand("insertHTML", `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkText}</a>`)
      setLinkUrl("")
      setLinkText("")
      setIsLinkDialogOpen(false)
    }
  }

  const insertImage = () => {
    if (imageUrl) {
      executeCommand("insertHTML", `<img src="${imageUrl}" alt="${imageAlt}" style="max-width: 100%; height: auto;" />`)
      setImageUrl("")
      setImageAlt("")
      setIsImageDialogOpen(false)
    }
  }

  const insertCodeBlock = () => {
    executeCommand(
      "insertHTML",
      `<pre style="background: #f5f5f5; padding: 12px; border-radius: 6px; font-family: monospace; overflow-x: auto;"><code>// Your code here</code></pre>`,
    )
  }

  const clearFormatting = () => {
    executeCommand("removeFormat")
    executeCommand("unlink")
  }

  return (
    <div className="border border-gray-200 rounded-lg bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-3 border-b border-gray-100 bg-gray-50/50">
        {/* Text Formatting */}
        <div className="flex items-center gap-1">
          <Toggle
            size="sm"
            pressed={document.queryCommandState("bold")}
            onPressedChange={() => executeCommand("bold")}
            className="hover:bg-gray-100 data-[state=on]:bg-gray-200"
          >
            <Bold className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={document.queryCommandState("italic")}
            onPressedChange={() => executeCommand("italic")}
            className="hover:bg-gray-100 data-[state=on]:bg-gray-200"
          >
            <Italic className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={document.queryCommandState("underline")}
            onPressedChange={() => executeCommand("underline")}
            className="hover:bg-gray-100 data-[state=on]:bg-gray-200"
          >
            <Underline className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={document.queryCommandState("strikeThrough")}
            onPressedChange={() => executeCommand("strikeThrough")}
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
            onClick={() => executeCommand("formatBlock", "h1")}
            className="hover:bg-gray-100"
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => executeCommand("formatBlock", "h2")}
            className="hover:bg-gray-100"
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => executeCommand("formatBlock", "h3")}
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
            onClick={() => executeCommand("insertUnorderedList")}
            className="hover:bg-gray-100"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => executeCommand("insertOrderedList")}
            className="hover:bg-gray-100"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => executeCommand("formatBlock", "blockquote")}
            className="hover:bg-gray-100"
          >
            <Quote className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6 bg-gray-200" />

        {/* Alignment */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => executeCommand("justifyLeft")} className="hover:bg-gray-100">
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => executeCommand("justifyCenter")}
            className="hover:bg-gray-100"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => executeCommand("justifyRight")}
            className="hover:bg-gray-100"
          >
            <AlignRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => executeCommand("justifyFull")} className="hover:bg-gray-100">
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
            onClick={() =>
              executeCommand(
                "insertHTML",
                "<code style='background: #f5f5f5; padding: 2px 4px; border-radius: 3px; font-family: monospace;'>code</code>",
              )
            }
            className="hover:bg-gray-100"
          >
            <Code className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={insertCodeBlock} className="hover:bg-gray-100">
            <Code2 className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6 bg-gray-200" />

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => executeCommand("undo")} className="hover:bg-gray-100">
            <Undo className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => executeCommand("redo")} className="hover:bg-gray-100">
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
        className="min-h-[400px] p-4 focus:outline-none prose prose-sm max-w-none"
        style={{
          wordBreak: "break-word",
        }}
        dangerouslySetInnerHTML={{ __html: value }}
        data-placeholder={placeholder}
      />

      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
        
        [contenteditable] h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 0.67em 0;
        }
        
        [contenteditable] h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 0.75em 0;
        }
        
        [contenteditable] h3 {
          font-size: 1.17em;
          font-weight: bold;
          margin: 0.83em 0;
        }
        
        [contenteditable] blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 1rem;
          margin: 1rem 0;
          font-style: italic;
          color: #6b7280;
        }
        
        [contenteditable] ul, [contenteditable] ol {
          padding-left: 2rem;
          margin: 1rem 0;
        }
        
        [contenteditable] li {
          margin: 0.5rem 0;
        }
        
        [contenteditable] a {
          color: #3b82f6;
          text-decoration: underline;
        }
        
        [contenteditable] img {
          max-width: 100%;
          height: auto;
          border-radius: 6px;
          margin: 1rem 0;
        }
      `}</style>
    </div>
  )
}
