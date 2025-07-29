import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function CampaignsPage() {
  const campaigns = [
    {
      id: 1,
      title: "Weekly Newsletter #47",
      status: "sent",
      sentDate: "2024-01-15T10:00:00Z",
      openRate: 26.4,
      clickRate: 3.2,
      subscribers: 2847,
    },
    {
      id: 2,
      title: "Product Update: New Features",
      status: "sent",
      sentDate: "2024-01-12T14:30:00Z",
      openRate: 31.2,
      clickRate: 4.1,
      subscribers: 2834,
    },
    {
      id: 3,
      title: "Welcome Series - Part 3",
      status: "draft",
      sentDate: null,
      openRate: null,
      clickRate: null,
      subscribers: null,
    },
    {
      id: 4,
      title: "Holiday Special Offer",
      status: "sent",
      sentDate: "2024-01-08T09:15:00Z",
      openRate: 28.7,
      clickRate: 5.3,
      subscribers: 2821,
    },
    {
      id: 5,
      title: "Monthly Roundup - December",
      status: "sent",
      sentDate: "2024-01-01T12:00:00Z",
      openRate: 22.1,
      clickRate: 2.8,
      subscribers: 2798,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
          <p className="text-muted-foreground">Manage your newsletter campaigns</p>
        </div>
        <Button asChild>
          <Link href="/campaigns/new">
            <Plus className="mr-2 h-4 w-4" />
            New Campaign
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Campaigns</CardTitle>
          <CardDescription>View and manage all your newsletter campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sent Date</TableHead>
                <TableHead>Open Rate</TableHead>
                <TableHead>Click Rate</TableHead>
                <TableHead>Subscribers</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell>
                    <div className="font-medium">{campaign.title}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={campaign.status === "sent" ? "default" : "secondary"}>{campaign.status}</Badge>
                  </TableCell>
                  <TableCell>
                    {campaign.sentDate
                      ? new Date(campaign.sentDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "-"}
                  </TableCell>
                  <TableCell>{campaign.openRate ? `${campaign.openRate}%` : "-"}</TableCell>
                  <TableCell>{campaign.clickRate ? `${campaign.clickRate}%` : "-"}</TableCell>
                  <TableCell>{campaign.subscribers ? campaign.subscribers.toLocaleString() : "-"}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuItem>View Analytics</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
