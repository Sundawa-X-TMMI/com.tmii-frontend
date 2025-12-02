"use client";

import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";
import type * as React from "react";

import {NavMain} from "@/components/nav-main";
import {NavProjects} from "@/components/nav-projects";
import {NavUser} from "@/components/nav-user";
import {TeamSwitcher} from "@/components/team-switcher";
import {Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail,} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "Tmii",
    email: "tmii@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "TMII",
      logo: "/images/tmii.png",
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "dashboard",
      icon: Frame,
    },
    {
      title: "Masteradata",
      url: "#",
      icon: SquareTerminal,
      items: [
        {
          title: "Wahana x Museum",
          url: "wahana",
        },
        {
          title: "Anjungan",
          url: "anjungan",
        },
        {
          title: "Tenant",
          url: "tenant",
        },
        {
          title: "Akun Bank",
          url: "bank",
        },
        {
          title: "Produk",
          url: "produk",
        },
      ],
    },
    {
      title: "Manajemen User",
      url: "#",
      icon: SquareTerminal,
      items: [
        {
          title: "Role",
          url: "role",
        },
        {
          title: "Users",
          url: "users",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Transactions",
      url: "transactions",
      icon: Frame,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
