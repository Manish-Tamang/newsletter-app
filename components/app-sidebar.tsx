"use client"

import { Mail, Settings, Users, Home, BarChart3, FileText, ImageIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const navigation = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Campaigns", url: "/campaigns", icon: Mail },
  { title: "Subscribers", url: "/subscribers", icon: Users },
  { title: "Templates", url: "/templates", icon: FileText },
  { title: "Media", url: "/media", icon: ImageIcon },
  { title: "Settings", url: "/settings", icon: Settings },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="border-r-0 bg-white">
      <SidebarHeader className="border-b-0 px-6 py-8">
        <div className="space-y-1">
          <div className="text-xl font-medium">Newsletter Pro</div>
          <div className="text-sm text-gray-500">Dashboard</div>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-6">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    className="w-full justify-start px-0 py-3 text-gray-600 hover:text-black hover:bg-transparent data-[active=true]:bg-transparent data-[active=true]:text-black data-[active=true]:font-medium"
                  >
                    <Link href={item.url}>
                      <item.icon className="size-4 mr-3" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
