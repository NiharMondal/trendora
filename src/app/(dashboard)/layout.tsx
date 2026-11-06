import { getServerSession } from "next-auth";
import React from "react";

import { DashboardSidebar } from "@/layouts/dashboard/dashboard-sidebar";
import DashboardTabs from "@/layouts/dashboard/dashboard-tabs";
import VendorBalance from "@/layouts/dashboard/vendor-balance";
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
            <section className="w-full">
                {/* No global search box and no notification bell here: neither
                    had a handler, and every dashboard table has its own search.
                    The balance is real and vendor-only — it replaced a
                    hardcoded "$12627" that every role saw (FE-09). */}
                <div className="flex items-center justify-between border-b py-3 md:px-2 pr-2 text-foreground/70 sticky top-0 right-0 bg-white z-20 min-h-16">
                    <SidebarTrigger className="cursor-pointer" />
                    {role === EnumUserRole.VENDOR ? <VendorBalance /> : null}
                </div>
                <div className="p-2 sm:px-3 md:p-5 bg-neutral-light">
                    <DashboardTabs role={role as EnumUserRole} />
                    {children}
                </div>
            </section>
        </SidebarProvider>
    );
}
