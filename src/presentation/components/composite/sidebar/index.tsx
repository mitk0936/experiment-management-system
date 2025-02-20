"use client";

import React from "react";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/presentation/components/ui/sidebar";
import { Home } from "lucide-react";
import { Separator } from "@/presentation/components/ui/separator";
import SignOutButton from "../sign-out-button";
import { usePathname } from "next/navigation";

type IconTypes = {
  className: string;
};

const menuItems = [
  {
    id: "dashboard",
    Icon: ({ className }: IconTypes) => <Home className={className} />,
    label: "Dashboard",
    href: "/dashboard",
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  const isMatchingRoute = React.useCallback(
    (url: string) => {
      return Boolean(pathname === url);
    },
    [pathname],
  );

  return (
    <Sidebar className="w-64 bg-sidebar text-sidebar-foreground">
      <SidebarHeader className="h-20 border-b justify-center items-center">
        <h1 className="text-lg font-bold">Experiments Management</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map(({ id, href, Icon, label }) => (
            <SidebarMenuItem key={`sidebar-menu-item-${id}`}>
              <Link
                href={href}
                className="block px-4 py-2 hover:bg-sidebar-accent rounded flex gap-3"
              >
                <Icon className={isMatchingRoute(href) ? "text-blue-500" : ""} />
                {label}
              </Link>
            </SidebarMenuItem>
          ))}
          <Separator />
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SignOutButton />
      </SidebarFooter>
    </Sidebar>
  );
}
