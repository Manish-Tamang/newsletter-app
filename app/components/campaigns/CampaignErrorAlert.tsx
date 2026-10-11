"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

interface Props {
  error?: string | null
  onClear: () => void
}

export function CampaignErrorAlert({ error, onClear }: Props) {
  if (!error) return null
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        {error}
        <Button variant="link" size="sm" onClick={onClear} className="p-0 h-auto">
          Dismiss
        </Button>
      </AlertDescription>
    </Alert>
  )
}


