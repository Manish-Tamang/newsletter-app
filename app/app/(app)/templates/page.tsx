"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTemplates, Template } from "@/hooks/use-templates"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function TemplatesPage() {
  const router = useRouter()
  const { templates, loading, deleteTemplate, error } = useTemplates()
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || template.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const handleEdit = (template: Template) => {
    router.push(`/templates/${template.id}/edit`)
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      await deleteTemplate(id)
    } catch (err) {
    } finally {
      setDeletingId(null)
    }
  }

  const handleUseTemplate = (template: Template) => {
    router.push(`/campaigns/new?template=${template.id}`)
  }

  const categories = ["All", ...Array.from(new Set(templates.map(t => t.category))).sort()]

  if (loading) {
    return <TemplatesLoading />
  }

  return (
    <div className="max-w-4xl mx-auto space-y-16 py-8 px-6">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-4xl font-medium tracking-tight">Email Templates</h1>
        <p className="text-lg text-gray-600 max-w-2xl">
          Create beautiful, responsive email templates that engage your subscribers. Choose from our collection or build
          your own custom designs.
        </p>

        <div className="flex items-center gap-4 pt-4">
          <Button asChild className="bg-black text-white hover:bg-gray-800 rounded-full px-6">
            <Link href="/templates/new">
              New Template
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">{templates.length} templates available</span>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-8">
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider">CATEGORIES</h2>

        <div className="flex gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setCategoryFilter(category === "All" ? "all" : category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                (category === "All" && categoryFilter === "all") || category === categoryFilter 
                  ? "bg-black text-white" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="space-y-8">
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider">ALL TEMPLATES</h2>

        {templates.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">No templates yet</div>
            <Button asChild className="bg-black text-white hover:bg-gray-800 rounded-full px-6">
              <Link href="/templates/new">
                Create Your First Template
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}

        {templates.length > 0 && filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">No templates found</div>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={() => setSearchTerm("")}>
                Clear Search
              </Button>
              <Button variant="outline" onClick={() => setCategoryFilter("all")}>
                Clear Filters
              </Button>
            </div>
          </div>
        )}

        {filteredTemplates.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredTemplates.map((template) => (
              <div key={template.id} className="space-y-4">
                {/* Template Preview */}
                <div className="aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden">
                  {template.previewImage ? (
                    <img
                      src={template.previewImage}
                      alt={template.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-gray-400 text-sm">No preview</div>
                    </div>
                  )}
                </div>

                {/* Template Info */}
                <div className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">{template.name}</h3>
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                        {template.category}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{template.description}</p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>
                      Modified{" "}
                      {new Date(template.updatedAt || template.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span>Used {template.usage || 0} times</span>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex-1 bg-transparent text-xs"
                      onClick={() => handleEdit(template)}
                    >
                      Edit
                    </Button>
                    <Button 
                      size="sm"
                      className="flex-1 bg-black text-white hover:bg-gray-800 text-xs"
                      onClick={() => handleUseTemplate(template)}
                    >
                      Use Template
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="pt-8 border-t border-gray-100">
        <div className="text-sm text-gray-500">
          Last updated:{" "}
          {new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            timeZoneName: "short",
          })}
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

// Loading component
function TemplatesLoading() {
  return (
    <div className="max-w-4xl mx-auto space-y-16 py-8 px-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="h-10 bg-gray-200 rounded w-80"></div>
        <div className="h-6 bg-gray-200 rounded w-96"></div>
        <div className="flex items-center gap-4 pt-4">
          <div className="h-10 bg-gray-200 rounded-full w-32"></div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-8">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-8 bg-gray-200 rounded-full w-20"></div>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="space-y-8">
        <div className="h-4 bg-gray-200 rounded w-28"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="aspect-[4/3] bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="w-8 h-8 bg-gray-300 rounded"></div>
              </div>
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="h-5 bg-gray-200 rounded w-32"></div>
                    <div className="h-5 bg-gray-200 rounded w-20"></div>
                  </div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="flex gap-2">
                  <div className="h-8 bg-gray-200 rounded flex-1"></div>
                  <div className="h-8 bg-gray-200 rounded flex-1"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-8 border-t border-gray-100">
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </div>
    </div>
  )
}
