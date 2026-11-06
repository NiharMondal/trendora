"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
    SidebarTrigger,
} from "@/shared/ui/sidebar";
import { EnumUserRole } from "@/features/auth/constants/user-role";

import { TSessionResponse } from "@/features/auth/types/session.types";
import { useMyProfileQuery } from "@/features/users/api/user.api";

import { getDashboardNav } from "./dashboard-navlink";
import NavMain from "./nav-main";
import { NavUser } from "./nav-user";
import VendorBalance from "./vendor-balance";

type TProps = {
    session: TSessionResponse | null;
    role: EnumUserRole;
};

export function DashboardSidebar({ session, role }: TProps) {
    const { data } = useMyProfileQuery(undefined);

    const { label, navLink } = getDashboardNav(role);

    const userImage = data?.result?.avatar || "";
    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="h-14 flex-row items-center justify-between border-b px-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
                <span className="truncate text-sm font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
                    {label}
                </span>
                <SidebarTrigger
                    className="size-8 cursor-pointer text-muted-foreground hover:text-foreground"
                    aria-label="Toggle sidebar"
                />
            </SidebarHeader>
            <SidebarContent>
                <NavMain navLink={navLink} />
            </SidebarContent>
            <SidebarFooter>
                {role === EnumUserRole.VENDOR ? <VendorBalance /> : null}
                <NavUser
                    user={session?.user}
                    role={role}
                    userImage={userImage}
                />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
