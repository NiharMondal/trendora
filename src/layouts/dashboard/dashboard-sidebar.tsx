"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
} from "@/shared/ui/sidebar";
import { EnumUserRole } from "@/features/auth/constants/user-role";

import { TSessionResponse } from "@/features/auth/types/session.types";
import { useMyProfileQuery } from "@/features/users/api/user.api";

import {
    adminDashboardLinks,
    customerDashboardLinks,
} from "./dashboard-navlink";
import NavMain from "./nav-main";
import { NavUser } from "./nav-user";

type TProps = {
    session: TSessionResponse | null;
    role: EnumUserRole;
};

export function DashboardSidebar({ session, role }: TProps) {
    const { data } = useMyProfileQuery(undefined);
    const label =
        role === EnumUserRole.ADMIN ? "Admin Dashboard" : "Customer Dashboard";

    const navLink =
        role === EnumUserRole.ADMIN
            ? adminDashboardLinks
            : customerDashboardLinks;

    const userImage = data?.result?.avatar || "";
    return (
        <Sidebar>
            <SidebarContent>
                <NavMain label={label} navLink={navLink} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser
                    user={session?.user}
                    role={role}
                    userImage={userImage}
                />
            </SidebarFooter>
        </Sidebar>
    );
}
