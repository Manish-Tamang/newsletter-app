"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Users, Calendar, RefreshCw, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useSubscribers } from "@/hooks/use-subscribers"
import { useToast } from "@/hooks/use-toast"

export default function SubscriberListsPage() {
  const { audiences, contacts, isLoading, error, clearError, fetchAudiences } = useSubscribers()
  const { toast } = useToast()

  const getAudienceStats = (audienceId: string) => {
    const audienceContacts = contacts.filter(contact => contact.audienceId === audienceId)
    const activeContacts = audienceContacts.filter(contact => !contact.unsubscribed)
    const unsubscribedContacts = audienceContacts.filter(contact => contact.unsubscribed)
    
    return {
      total: audienceContacts.length,
      active: activeContacts.length,
      unsubscribed: unsubscribedContacts.length,
    }
  }

  const handleRefresh = async () => {
    await fetchAudiences()
    toast({
      title: "Success",
      description: "Audiences refreshed successfully!",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subscriber Lists</h1>
          <p className="text-muted-foreground">Manage your Resend.com audiences and subscriber lists</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button disabled>
            <Plus className="mr-2 h-4 w-4" />
            New List
          </Button>
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

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Lists</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{audiences.length}</div>
            <p className="text-xs text-muted-foreground">
              Available audiences
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contacts.length}</div>
            <p className="text-xs text-muted-foreground">
              Across all lists
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscribers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contacts.filter(contact => !contact.unsubscribed).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Ready to receive emails
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Lists</CardTitle>
          <CardDescription>View and manage your Resend.com audiences</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Loading audiences...</span>
            </div>
          ) : audiences.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No audiences found. Create your first audience in Resend.com dashboard.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>List Name</TableHead>
                  <TableHead>Total Subscribers</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead>Unsubscribed</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {audiences.map((audience) => {
                  const stats = getAudienceStats(audience.id)
                  return (
                    <TableRow key={audience.id}>
                      <TableCell>
                        <div className="font-medium">{audience.name}</div>
                        <div className="text-sm text-muted-foreground">ID: {audience.id}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{stats.total}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-green-600">{stats.active}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-red-600">{stats.unsubscribed}</div>
                      </TableCell>
                      <TableCell>
                        {new Date(audience.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </TableCell>
                      <TableCell>
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          Active
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About Resend.com Audiences</CardTitle>
          <CardDescription>How to manage your subscriber lists</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium">Creating Audiences</h4>
              <p className="text-sm text-muted-foreground">
                Create new audiences in your Resend.com dashboard. Each audience represents a subscriber list.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Managing Contacts</h4>
              <p className="text-sm text-muted-foreground">
                Add, remove, and manage contacts within each audience. Contacts can be active or unsubscribed.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Sending Campaigns</h4>
              <p className="text-sm text-muted-foreground">
                Send campaigns to specific audiences or all active subscribers across all audiences.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Analytics</h4>
              <p className="text-sm text-muted-foreground">
                Track email performance, open rates, and click rates for each audience and campaign.
              </p>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="text-blue-600">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium text-blue-900">Need to create a new audience?</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Visit your{" "}
                  <a
                    href="https://resend.com/audiences"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Resend.com dashboard
                  </a>{" "}
                  to create new audiences and manage your subscriber lists.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
