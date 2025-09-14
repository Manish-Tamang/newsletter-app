"use client"

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
import { MdDashboardCustomize } from "react-icons/md";
import { IoIosMail } from "react-icons/io";
import { IoPeople } from "react-icons/io5";
import { FaFileAlt } from "react-icons/fa";
import { AiFillSetting } from "react-icons/ai";

const navigation = [
  { title: "Dashboard", url: "/dashboard", icon: MdDashboardCustomize },
  { title: "Campaigns", url: "/campaigns", icon: IoIosMail },
  { title: "Subscribers", url: "/subscribers", icon: IoPeople },
  { title: "Templates", url: "/templates", icon: FaFileAlt },
  { title: "Settings", url: "/settings", icon: AiFillSetting },
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
                      <item.icon className="size-4 mr-1" />
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
