"use client"

import { AlignCenter, AlignLeft, AlignRight } from "lucide-react"
import type { Align } from "../../core/types"
import { Field } from "./Section"
import { Segmented } from "./Segmented"

export const ALIGN_OPTIONS = [
  { value: "left" as Align, label: <AlignLeft size={14} />, title: "Align left" },
  { value: "center" as Align, label: <AlignCenter size={14} />, title: "Align center" },
  { value: "right" as Align, label: <AlignRight size={14} />, title: "Align right" },
]

export function AlignField({
  value,
  onChange,
  label = "Alignment",
  options = ALIGN_OPTIONS,
}: {
  value: Align
  onChange: (value: Align) => void
  label?: string
  options?: typeof ALIGN_OPTIONS
}) {
  return (
    <Field label={label}>
      <Segmented value={value} options={options} onChange={onChange} ariaLabel={label} />
    </Field>
  )
}
