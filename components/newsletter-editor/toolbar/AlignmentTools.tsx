"use client"

import { AlignCenter, AlignLeft, AlignRight } from "lucide-react"
import type { Align } from "../core/types"
import { ToolbarButton, ToolbarGroup } from "./ToolbarGroup"

const OPTIONS: { value: Align; title: string; icon: typeof AlignLeft }[] = [
  { value: "left", title: "Align left", icon: AlignLeft },
  { value: "center", title: "Align center", icon: AlignCenter },
  { value: "right", title: "Align right", icon: AlignRight },
]

export function AlignmentTools({
  value,
  scope,
  disabled,
  onChange,
}: {
  value: Align
  scope: "block" | "email"
  disabled?: boolean
  onChange: (value: Align) => void
}) {
  return (
    <ToolbarGroup label={scope === "block" ? "Block align" : "Email align"}>
      {OPTIONS.map((option) => {
        const Icon = option.icon
        return (
          <ToolbarButton
            key={option.value}
            title={option.title}
            active={value === option.value}
            disabled={disabled}
            onClick={() => onChange(option.value)}
          >
            <Icon size={15} />
          </ToolbarButton>
        )
      })}
    </ToolbarGroup>
  )
}
