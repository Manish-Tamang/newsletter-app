"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, TrendingUp, AlertCircle, RefreshCw } from "lucide-react"
import { useSubscribers } from "@/hooks/use-subscribers"
import { AddSubscriberDialog } from "@/components/add-subscriber-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import React from "react"

export default function SubscribersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const { contacts, audiences, isLoading, error, addContact, deleteContact, clearError, fetchContacts } = useSubscribers()

  const ITEMS_PER_PAGE = 10

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Reset to first page when search term changes
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const totalPages = Math.ceil(filteredContacts.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedContacts = filteredContacts.slice(startIndex, endIndex)

  const handleAddSubscriber = async (subscriber: { firstName: string; lastName: string; email: string }) => {
    return await addContact(subscriber.email, subscriber.firstName, subscriber.lastName)
  }

  const handleDeleteContact = async (contactId: string) => {
    return await deleteContact(contactId)
  }

  const activeContacts = contacts.filter(contact => !contact.unsubscribed)
  const unsubscribedContacts = contacts.filter(contact => contact.unsubscribed)

  const renderPaginationItems = () => {
    const items = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is small
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              isActive={currentPage === i}
              onClick={(e) => {
                e.preventDefault()
                setCurrentPage(i)
              }}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        )
      }
    } else {
      // Show first page, last page, current page, and pages around current
      const startPage = Math.max(1, currentPage - 1)
      const endPage = Math.min(totalPages, currentPage + 1)

      // First page
      if (startPage > 1) {
        items.push(
          <PaginationItem key={1}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault()
                setCurrentPage(1)
              }}
            >
              1
            </PaginationLink>
          </PaginationItem>
        )
        if (startPage > 2) {
          items.push(
            <PaginationItem key="ellipsis1">
              <PaginationEllipsis />
            </PaginationItem>
          )
        }
      }

      // Pages around current
      for (let i = startPage; i <= endPage; i++) {
        if (i === 1 || i === totalPages) continue // Skip if already added
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              isActive={currentPage === i}
              onClick={(e) => {
                e.preventDefault()
                setCurrentPage(i)
              }}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        )
      }

      // Last page
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          items.push(
            <PaginationItem key="ellipsis2">
              <PaginationEllipsis />
            </PaginationItem>
          )
        }
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault()
                setCurrentPage(totalPages)
              }}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        )
      }
    }

    return items
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-16 py-8 px-6">
        <div className="space-y-4">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-6 w-96" />
          <div className="flex items-center gap-4 pt-4">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>

        <div className="space-y-8">
          <Skeleton className="h-4 w-24" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-40" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-64" />
          </div>
          <div className="space-y-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between py-6">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-40" />
                </div>
                <div className="space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-16 py-8 px-6">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-4xl font-medium tracking-tight">Subscribers</h1>
        <p className="text-lg text-gray-600 max-w-2xl">
          Manage your newsletter subscribers, track engagement, and organize your audience into targeted segments for
          better campaign performance.
        </p>

        <div className="flex items-center gap-4 pt-4">
          <AddSubscriberDialog
            isOpen={isAddDialogOpen}
            onOpenChange={setIsAddDialogOpen}
            onAddSubscriber={handleAddSubscriber}
            isLoading={isLoading}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={fetchContacts}
            disabled={isLoading}
            className="rounded-full"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">{contacts.length} total subscribers</span>
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
            <Button variant="link" size="sm" onClick={clearError} className="p-0 h-auto">
              Dismiss
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Quick Stats */}
      <div className="space-y-8">
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider">OVERVIEW</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-2">
            <div className="text-3xl font-medium">{contacts.length}</div>
            <div className="text-gray-600">Total Subscribers</div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span className="text-green-600">+{contacts.length > 0 ? "12" : "0"}</span>
              <span className="text-gray-500">this week</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-3xl font-medium">{activeContacts.length}</div>
            <div className="text-gray-600">Active</div>
            <div className="text-sm text-gray-500">
              {contacts.length > 0 ? `${((activeContacts.length / contacts.length) * 100).toFixed(1)}% of total` : "0% of total"}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-3xl font-medium">{unsubscribedContacts.length}</div>
            <div className="text-gray-600">Unsubscribed</div>
            <div className="text-sm text-gray-500">
              {contacts.length > 0 ? `${((unsubscribedContacts.length / contacts.length) * 100).toFixed(1)}% of total` : "0% of total"}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-3xl font-medium">{audiences.length}</div>
            <div className="text-gray-600">Audiences</div>
            <div className="text-sm text-gray-500">Available lists</div>
          </div>
        </div>
      </div>

      {/* Search and Subscribers List */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider">ALL SUBSCRIBERS</h2>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search subscribers..."
              className="pl-10 border-0 bg-gray-50 focus-visible:ring-0 focus-visible:ring-offset-0"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredContacts.length === 0 ? (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No subscribers found</h3>
            <p className="text-gray-600">
              {searchTerm ? "Try adjusting your search terms" : "Add your first subscriber to get started"}
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {paginatedContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center justify-between py-6 border-b border-gray-100 last:border-b-0"
                >
                  <div className="space-y-2">
                    <div className="font-medium text-lg">
                      {contact.firstName && contact.lastName 
                        ? `${contact.firstName} ${contact.lastName}`
                        : contact.email
                      }
                    </div>
                    <div className="text-gray-600">{contact.email}</div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          !contact.unsubscribed ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {!contact.unsubscribed ? "active" : "unsubscribed"}
                      </span>
                      {contact.createdAt && (
                        <span>
                          Joined{" "}
                          {new Date(contact.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      )}
                      <span>via Resend.com</span>
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <div
                      className={`text-sm font-medium ${
                        !contact.unsubscribed ? "text-green-600" : "text-gray-600"
                      }`}
                    >
                      {!contact.unsubscribed ? "Active" : "Unsubscribed"} Subscriber
                    </div>
                    <div className="text-sm text-gray-500">
                      {!contact.unsubscribed ? "Receiving emails" : "Not receiving emails"}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {filteredContacts.length > ITEMS_PER_PAGE && (
              <div className="flex items-center justify-between pt-6">
                <div className="text-sm text-gray-500">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredContacts.length)} of {filteredContacts.length} subscribers
                </div>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          if (currentPage > 1) setCurrentPage(currentPage - 1)
                        }}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    {renderPaginationItems()}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                        }}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
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
    </div>
  )
}
