// src/components/nav-projects.tsx
"use client"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"

export function NavProjects({
  projects,
  title = "Projects"
}: {
  projects: {
    name: string
    url: string
    icon: React.ComponentType<{ className?: string }>
    badge?: string
  }[]
  title?: string
}) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <a href={item.url}>
                <div className="flex items-center gap-2 flex-1">
                  <item.icon className="size-4" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <Badge variant="secondary" className="ml-2">
                    {item.badge}
                  </Badge>
                )}
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}