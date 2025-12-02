"use client"

import * as React from "react"
import { ChevronsUpDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function TeamSwitcher({
 teams,
}: {
  teams: {
    name: string
    logo: string
    plan: string
  }[]
}) {
  const [activeTeam, setActiveTeam] = React.useState(teams[0])

  return (
    <SidebarMenu>
      <Avatar className="h-16 w-32 rounded-lg ml-12">
        <AvatarImage
          src={activeTeam.logo}
          alt={activeTeam.name}
          className="object-contain p-1"
        />
        <AvatarFallback className="rounded-lg text-lg font-bold">
          {activeTeam.name.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
    </SidebarMenu>
  )
}