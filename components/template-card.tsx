"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Template } from "@/hooks/use-templates"
import { Eye, Edit, FileText, Trash2 } from "lucide-react"

interface TemplateCardProps {
  template: Template
  onEdit: (template: Template) => void
  onDelete: (id: string) => void
  onUse: (template: Template) => void
}

export function TemplateCard({ template, onEdit, onDelete, onUse }: TemplateCardProps) {
  return (
    <Card className="border border-gray-200 rounded-lg bg-white transition-colors hover:bg-gray-50">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">{template.name}</CardTitle>
        <CardDescription className="text-xs">{template.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          <span>{template.category}</span>
          <span>Used {template.usage} times</span>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1" onClick={() => onEdit(template)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button size="sm" className="flex-1" onClick={() => onUse(template)}>
            <FileText className="mr-2 h-4 w-4" />
            Use
          </Button>
          <Button size="sm" variant="ghost" className="flex-1 text-red-600" onClick={() => onDelete(template.id)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 