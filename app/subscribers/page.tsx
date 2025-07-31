"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, AlertCircle, RefreshCw } from "lucide-react"
import { useSubscribers } from "@/hooks/use-subscribers"
import { AddSubscriberDialog } from "@/components/add-subscriber-dialog"
import { SubscribersTable } from "@/components/subscribers-table"

export default function SubscribersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const { contacts, audiences, isLoading, error, addContact, deleteContact, clearError, fetchContacts } = useSubscribers()

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddSubscriber = async (subscriber: { firstName: string; lastName: string; email: string }) => {
    return await addContact(subscriber.email, subscriber.firstName, subscriber.lastName)
  }

  const handleDeleteContact = async (contactId: string) => {
    return await deleteContact(contactId)
  }

  const activeContacts = contacts.filter(contact => !contact.unsubscribed)
  const unsubscribedContacts = contacts.filter(contact => contact.unsubscribed)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subscribers</h1>
          <p className="text-muted-foreground">Manage your newsletter subscribers</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchContacts}
            disabled={isLoading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <AddSubscriberDialog
            isOpen={isAddDialogOpen}
            onOpenChange={setIsAddDialogOpen}
            onAddSubscriber={handleAddSubscriber}
            isLoading={isLoading}
          />
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

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contacts.length}</div>
            <p className="text-xs text-muted-foreground">
              {contacts.length > 0 ? "From Resend.com" : "No subscribers yet"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeContacts.length}</div>
            <p className="text-xs text-muted-foreground">
              {contacts.length > 0 ? `${((activeContacts.length / contacts.length) * 100).toFixed(1)}% of total` : "0% of total"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unsubscribed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unsubscribedContacts.length}</div>
            <p className="text-xs text-muted-foreground">
              {contacts.length > 0 ? `${((unsubscribedContacts.length / contacts.length) * 100).toFixed(1)}% of total` : "0% of total"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Audiences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{audiences.length}</div>
            <p className="text-xs text-muted-foreground">Available lists</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Subscribers</CardTitle>
              <CardDescription>View and manage all your newsletter subscribers from Resend.com</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search subscribers..."
                  className="pl-8 w-[300px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <SubscribersTable
            contacts={filteredContacts}
            onDelete={handleDeleteContact}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  )
}
