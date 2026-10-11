"use client"

import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"

interface DeleteSubscriberButtonProps {
  contactId: string
  contactName: string
  onDelete: (contactId: string) => Promise<{ success: boolean; error?: string }>
  isLoading?: boolean
  variant?: "button" | "dropdown-item"
}

export function DeleteSubscriberButton({ 
  contactId, 
  contactName, 
  onDelete, 
  isLoading = false,
  variant = "button"
}: DeleteSubscriberButtonProps) {
  const { toast } = useToast()

  const handleDelete = async () => {
    const result = await onDelete(contactId)

    if (result.success) {
      toast({
        title: "Success",
        description: "Contact deleted successfully!",
      })
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to delete contact",
        variant: "destructive",
      })
    }
  }

  if (variant === "dropdown-item") {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <div className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-red-600">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </div>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Subscriber</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{contactName}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Subscriber</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{contactName}"? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
} 