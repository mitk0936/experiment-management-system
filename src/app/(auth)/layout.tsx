import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "./__components/sidebar";
import ThemeToggleButton from "@/components/utils/theme-toggle-button";

type Props = {
  children: ReactNode;
};

export default async function AuthLayout({ children }: Props) {
  const session = await getServerSession(authOptions);

  // Redirect unauthenticated users to the login page
  if (!session) {
    redirect("/");
  }

  return (
    <div className="flex h-screen">
      <SidebarProvider>
        <DashboardSidebar />

        <div className="flex-1 h-full">
          <header className="sticky h-20 top-0 z-1">
            <div className="px-4 py-3 h-20 bg-white dark:bg-black border-b flex items-center justify-between">
              <SidebarTrigger />
              <ThemeToggleButton />
            </div>
          </header>
          <main className="flex h-max w-full">{children}</main>
        </div>
      </SidebarProvider>
    </div>
  );
}
