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

export function DashboardSidebar({ role }: { role: EnumUserRole }) {
    const label =
        role === EnumUserRole.ADMIN ? "Admin Dashboard" : "Customer Dashboard";

    const navLink =
        role === EnumUserRole.ADMIN
            ? adminNavlink
            : customerDashboardCardOptions;

    const user = {
        name: "Nihar",
        email: "[EMAIL_ADDRESS]",
        avatar: "https://github.com/shadcn.png",
    };

    return (
        <Sidebar>
            <SidebarContent>
                <NavMain label={label} navLink={navLink} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={user} />
            </SidebarFooter>
        </Sidebar>
    );
}
