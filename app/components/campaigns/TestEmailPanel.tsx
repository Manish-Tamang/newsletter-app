"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Props {
  testEmail: string
  setTestEmail: (v: string) => void
  disabled: boolean
  onSendTest: () => void
}

export function TestEmailPanel({ testEmail, setTestEmail, disabled, onSendTest }: Props) {
  return (
    <div className="space-y-6">
      <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">TEST EMAIL</h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Test Recipients</Label>
          <Input
            placeholder="Enter email addresses"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            className="border-0 bg-gray-50 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <p className="text-xs text-gray-500">Press Enter to add multiple recipients</p>
        </div>
        <Button onClick={onSendTest} disabled={disabled} className="w-full bg-gray-900 hover:bg-gray-800 text-white">
          Send Test Email
        </Button>
      </div>
    </div>
  )
}


