import { getServerSession } from "next-auth";
import React from "react";

import { DashboardSidebar } from "@/layouts/dashboard/dashboard-sidebar";
import DashboardTabs from "@/layouts/dashboard/dashboard-tabs";
import { TSessionResponse } from "@/features/auth/types/session.types";
import { SidebarProvider, SidebarTrigger } from "@/shared/ui/sidebar";
import { EnumUserRole } from "@/features/auth/constants/user-role";
import { authOptions } from "@/features/auth/lib/auth-options";
export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    const role = (session as TSessionResponse)?.user?.role;

    return (
        <SidebarProvider>
            <DashboardSidebar
                session={session as TSessionResponse}
                role={role as EnumUserRole}
            />
            <section className="w-full min-w-0 flex-1">
                {/* Desktop has no top bar: the trigger lives in the sidebar
                    header, and the vendor balance in the sidebar footer. On
                    mobile the sidebar is a closed drawer, so a trigger inside
                    it could never open it — this slim bar is the way in. */}
                <div className="sticky top-0 z-20 flex h-12 items-center border-b bg-white px-2 md:hidden">
                    <SidebarTrigger
                        className="size-9 cursor-pointer"
                        aria-label="Open navigation"
                    />
                </div>
                <main
                    id="main-content"
                    tabIndex={-1}
                    className="p-2 sm:px-3 md:p-5 bg-neutral-light outline-none"
                >
                    <DashboardTabs role={role as EnumUserRole} />
                    {children}
                </main>
            </section>
        </SidebarProvider>
    );
}
