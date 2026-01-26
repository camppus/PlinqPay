"use client";

import * as React from "react";
import {
  IconChartBar,
  IconCoins,
  IconDatabase,
  IconFileExcel,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconListDetails,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Logo from "./Logo";

const data = {
  user: {
    name: "Admin PliqPay",
    email: "pliqpay@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Transações",
      url: "/dashboard/admin",
      icon: IconChartBar,
    },
    {
      title: "Saques",
      url: "/dashboard/admin/withdrawls",
      icon: IconCoins,
    },
    {
      title: "Chaves",
      url: "/dashboard/admin/keys",
      icon: IconFolder,
    },
    {
      title: "Empresas",
      url: "/dashboard/admin/users",
      icon: IconUsers,
    },
  ],

  navSecondary: [
    {
      title: "Configurações",
      url: "/dashboard/admin/profile",
      icon: IconSettings,
    },
    {
      title: "Suporte",
      url: "#",
      icon: IconHelp,
    },
  ],
  documents: [
    {
      name: "Exportar em cv",
      url: "#",
      icon: IconDatabase,
    },
    {
      name: "Exportar em excel",
      url: "#",
      icon: IconFileExcel,
    },
    {
      name: "Exportar em pdf",
      url: "#",
      icon: IconFileWord,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <Logo />
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
