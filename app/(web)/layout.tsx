import type React from "react"
import type { Metadata } from "next"
import { SiteHeader } from "@/components/web/site-header"
import { SiteFooter } from "@/components/web/site-footer"

export const metadata: Metadata = {
  title: "Home",
  description: "Gulle is a newsletter workspace for campaigns, subscribers, and emails that stay aligned.",
}

export default function WebLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-white text-zinc-950">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}
