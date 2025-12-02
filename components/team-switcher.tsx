"use client"

import { Avatar, AvatarImage } from "@/components/ui/avatar"
import {
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function TeamSwitcher({
      teams,
 }: {
  teams: {
    name: string
    logo: string
    plan: string
  }[]
}) {
  const team = teams[0]

  return (
    <SidebarMenu>
      <SidebarMenuItem className="py-4">
        <Avatar className="h-16 w-56 rounded-xl">
          <AvatarImage
            src={team.logo}
            alt={team.name}
            className="object-contain p-3"
          />
        </Avatar>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}