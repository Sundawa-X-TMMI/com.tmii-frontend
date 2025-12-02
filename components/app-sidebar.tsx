"use client";

import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command, Database,
  Frame,
  GalleryVerticalEnd, LayoutDashboard,
  Map,
  PieChart, Receipt,
  Settings2,
  SquareTerminal, Users,
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
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Master Data",
      url: "#",
      icon: Database,
      items: [
        {
          title: "Wahana x Museum",
          url: "/internals/wahana",
        },
        {
          title: "Anjungan",
          url: "/internals/anjungan",
        },
        {
          title: "Tenant",
          url: "/internals/tenant",
        },
        {
          title: "Akun Bank",
          url: "/internals/bank",
        },
        {
          title: "Produk",
          url: "/internals/produk",
        },
      ],
    },
    {
      title: "Manajemen User",
      url: "#",
      icon: Users,
      items: [
        {
          title: "Users",
          url: "/internals/users",
        },
      ],
    },
    {
      title: "Transactions",
      url: "/internals/transaction",
      icon: Receipt
    },
    {
      title: "Manajemen Member",
      url: "member",
      icon: Users,
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
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
