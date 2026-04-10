
import { Bell } from "lucide-react";
import { getServerSession } from "next-auth";
import React from "react";

import { DashboardSidebar } from "@/components/layout/dashboard/dashboard-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { EnumUserRole } from "@/global/user-role";
import { authOptions } from "@/lib/authOptions";
export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {

	const session = await getServerSession(authOptions)

	const role: EnumUserRole = (session as any)?.user?.role;

    return (
        <SidebarProvider>
            <DashboardSidebar role={role} />
            <section className="w-full">
                <div className="flex items-center justify-between border-b py-5 md:px-2 pr-2 text-foreground/70 sticky top-0 right-0 bg-white z-20">
                    <SidebarTrigger className="cursor-pointer" />
                    <div className="">
                        <input
                            type="text"
                            placeholder="Search anything..."
                            className="outline-none border-none ring ring-neutral-dark/20 focus:ring-2 focus:ring-accent/50 rounded-full px-4 py-2 xl:min-w-xl"
                        />
                    </div>
                    <div className="flex items-center gap-x-4 xl:gap-x-10">
                        <div className="p-2 bg-gray-100 rounded-full cursor-pointer">
                            <Bell />
                        </div>
                        <div className="hidden md:block">
                            <p>Your Balance</p>
                            <p>
                                <strong>$12627</strong>
                            </p>
                        </div>
                    </div>
                </div>
                <div className="p-2 sm:px-3 md:p-5 bg-neutral-light">
                    {children}
                </div>
            </section>
        </SidebarProvider>
    );
}
