import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import React, { PropsWithChildren, ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/presentation/components/ui/sidebar";
import DashboardSidebar from "../../presentation/components/composite/sidebar";
import { PAGE_ROUTES } from "@/presentation/routes/constants";

export default async function AuthLayout({ children }: PropsWithChildren) {
  const session = await getServerSession(authOptions);

  // Redirect unauthenticated users to the login page
  if (!session) {
    redirect(PAGE_ROUTES.login);
  }

  return (
    <div className="flex h-screen">
      <SidebarProvider>
        <DashboardSidebar />

        <div className="flex-1 h-full">
          <header className="sticky h-20 top-0 z-1">
            <div className="px-4 py-3 h-20 bg-white dark:bg-black border-b flex items-center justify-between">
              <SidebarTrigger />
            </div>
          </header>
          <main className="flex h-max w-full">{children}</main>
        </div>
      </SidebarProvider>
    </div>
  );
}
