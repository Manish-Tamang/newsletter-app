"use client"

import {
  Mail,
  Settings,
  Users,
  Home,
  Plus,
  List,
  ImageIcon,
  FileText,
  ChevronDown,
  BarChart3,
  Tags,
} from "lucide-react"
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

const navigation = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Subscribers",
    icon: Users,
    items: [
      {
        title: "All Subscribers",
        url: "/subscribers",
        icon: Users,
      },
      {
        title: "Lists",
        url: "/subscribers/lists",
        icon: List,
      },
      {
        title: "Segments",
        url: "/subscribers/segments",
        icon: Tags,
      },
    ],
  },
  {
    title: "Campaigns",
    icon: Mail,
    items: [
      {
        title: "All Campaigns",
        url: "/campaigns",
        icon: Mail,
      },
      {
        title: "Create New",
        url: "/campaigns/new",
        icon: Plus,
      },
      {
        title: "Analytics",
        url: "/campaigns/analytics",
        icon: BarChart3,
      },
    ],
  },
  {
    title: "Templates",
    icon: FileText,
    items: [
      {
        title: "Email Templates",
        url: "/templates",
        icon: FileText,
      },
      {
        title: "Create Template",
        url: "/templates/new",
        icon: Plus,
      },
    ],
  },
  {
    title: "Media",
    icon: ImageIcon,
    items: [
      {
        title: "All Media",
        url: "/media",
        icon: ImageIcon,
      },
      {
        title: "Upload",
        url: "/media/upload",
        icon: Plus,
      },
    ],
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 px-4 py-3">
          <div className="flex flex-col gap-0.5 leading-none">
            <span className="font-medium">Newsletter Pro</span>
            <span className="text-xs text-muted-foreground">Dashboard</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="gap-0">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => {
                if (item.items) {
                  return (
                    <Collapsible key={item.title} defaultOpen className="group/collapsible">
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton className="w-full">
                            <item.icon className="size-4" />
                            <span>{item.title}</span>
                            <ChevronDown className="ml-auto size-3 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton asChild isActive={pathname === subItem.url}>
                                  <Link href={subItem.url}>
                                    <subItem.icon className="size-4" />
                                    <span>{subItem.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  )
                }
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                      <Link href={item.url!}>
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
