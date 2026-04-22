"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
} from "@/components/ui/sidebar";
import { EnumUserRole } from "@/global/user-role";

import {
    adminNavlink,
    customerDashboardCardOptions,
} from "./dashboard-navlink";
import NavMain from "./nav-main";
import { NavUser } from "./nav-user";
import { TSessionResponse } from "@/components/types/session.types";

type TProps = {
    session: TSessionResponse | null;
    role: EnumUserRole;
}

export function DashboardSidebar({ session, role }: TProps) {
    const label =
        role === EnumUserRole.ADMIN ? "Admin Dashboard" : "Customer Dashboard";

    const navLink =
        role === EnumUserRole.ADMIN
            ? adminNavlink
            : customerDashboardCardOptions;

    return (
        <Sidebar>
            <SidebarContent>
                <NavMain label={label} navLink={navLink} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={session?.user} role={role} />
            </SidebarFooter>
        </Sidebar>
    );
}
