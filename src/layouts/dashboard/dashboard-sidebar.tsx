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
    vendorDashboardLinks,
} from "./dashboard-navlink";
import NavMain from "./nav-main";
import { NavUser } from "./nav-user";

type TProps = {
    session: TSessionResponse | null;
    role: EnumUserRole;
};

export function DashboardSidebar({ session, role }: TProps) {
    const { data } = useMyProfileQuery(undefined);

    // Three sidebars now, so this is a lookup rather than a ternary.
    const { label, navLink } = (() => {
        switch (role) {
            case EnumUserRole.ADMIN:
            case EnumUserRole.SUPER_ADMIN:
                return {
                    label: "Admin Dashboard",
                    navLink: adminDashboardLinks,
                };
            case EnumUserRole.VENDOR:
                return {
                    label: "Seller Dashboard",
                    navLink: vendorDashboardLinks,
                };
            default:
                return {
                    label: "Customer Dashboard",
                    navLink: customerDashboardLinks,
                };
        }
    })();

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
