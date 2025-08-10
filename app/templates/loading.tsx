import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function TemplatesLoading() {
  return (
    <div className="max-w-6xl mx-auto space-y-16 py-8 px-6">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-6">
              <div className="aspect-[4/3] bg-gray-200 rounded-lg"></div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="h-6 bg-gray-200 rounded w-32"></div>
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="flex gap-3">
                  <div className="h-10 bg-gray-200 rounded flex-1"></div>
                  <div className="h-10 bg-gray-200 rounded flex-1"></div>
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