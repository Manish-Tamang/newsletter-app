"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, MoreHorizontal, Upload, ImageIcon } from "lucide-react"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function MediaPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const mediaFiles = [
    {
      id: 1,
      name: "newsletter-header.png",
      type: "image",
      size: "245 KB",
      uploadDate: "2024-01-15T10:00:00Z",
      url: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 2,
      name: "product-screenshot.jpg",
      type: "image",
      size: "1.2 MB",
      uploadDate: "2024-01-12T14:30:00Z",
      url: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 3,
      name: "company-logo.svg",
      type: "image",
      size: "12 KB",
      uploadDate: "2024-01-10T09:15:00Z",
      url: "/placeholder.svg?height=200&width=300",
    },
  ]

  const filteredMedia = mediaFiles.filter((file) => file.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Media Library</h1>
          <p className="text-muted-foreground">Manage images and files for your campaigns</p>
        </div>
        <Button asChild>
          <Link href="/media/upload">
            <Upload className="mr-2 h-4 w-4" />
            Upload Media
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Media</CardTitle>
              <CardDescription>Browse and manage your uploaded media files</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search media..."
                  className="pl-8 w-[300px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredMedia.map((file) => (
              <Card key={file.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                      <img
                        src={file.url || "/placeholder.svg"}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="font-medium text-sm truncate">{file.name}</div>
                      <div className="text-xs text-muted-foreground">{file.size}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(file.uploadDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Button size="sm" variant="outline">
                        <ImageIcon className="mr-2 h-4 w-4" />
                        Insert
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Copy URL</DropdownMenuItem>
                          <DropdownMenuItem>Download</DropdownMenuItem>
                          <DropdownMenuItem>Rename</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
