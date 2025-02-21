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
} from "@/presentation/common/components/ui/sidebar";
import { Home, User } from "lucide-react";
import { Separator } from "@/presentation/common/components/ui/separator";
import SignOutButton from "./SignOutButton";
import { usePathname } from "next/navigation";

type IconParams = {
  className: string;
};

const menuItems = [
  {
    id: "dashboard",
    Icon: ({ className }: IconParams) => <Home className={className} />,
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    id: "profile",
    Icon: ({ className }: IconParams) => <User className={className} />,
    label: "Profile",
    href: "/profile",
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
                <Icon className={isMatchingRoute(href) ? "text-primary" : ""} />
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
