"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, UserPlus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

interface AddSubscriberDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onAddSubscriber: (subscriber: { firstName: string; lastName: string; email: string }) => Promise<{ success: boolean; error?: string }>
  isLoading?: boolean
}

export function AddSubscriberDialog({ isOpen, onOpenChange, onAddSubscriber, isLoading = false }: AddSubscriberDialogProps) {
  const [newSubscriber, setNewSubscriber] = useState({ firstName: "", lastName: "", email: "" })
  const { toast } = useToast()

  const handleAddSubscriber = async () => {
    if (!newSubscriber.email) {
      toast({
        title: "Error",
        description: "Email is required",
        variant: "destructive",
      })
      return
    }

    const result = await onAddSubscriber(newSubscriber)

    if (result.success) {
      toast({
        title: "Success",
        description: "Subscriber added successfully!",
      })
      setNewSubscriber({ firstName: "", lastName: "", email: "" })
      onOpenChange(false)
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to add subscriber",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Subscriber
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Subscriber</DialogTitle>
          <DialogDescription>Add a new subscriber to your newsletter list</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="Enter first name"
                value={newSubscriber.firstName}
                onChange={(e) => setNewSubscriber({ ...newSubscriber, firstName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Enter last name"
                value={newSubscriber.lastName}
                onChange={(e) => setNewSubscriber({ ...newSubscriber, lastName: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email address"
              value={newSubscriber.email}
              onChange={(e) => setNewSubscriber({ ...newSubscriber, email: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddSubscriber} disabled={isLoading}>
            <UserPlus className="mr-2 h-4 w-4" />
            {isLoading ? "Adding..." : "Add Subscriber"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 