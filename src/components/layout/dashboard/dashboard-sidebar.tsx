"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { EnumUserRole } from "@/global/user-role";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/redux/redux.hooks";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { adminNavlink, customerNavlink } from "./dashboard-navlink";

export function DashboardSidebar() {
    const pathname = usePathname();
    const { user } = useAppSelector((state) => state.auth);

    const label =
        user?.role === EnumUserRole.ADMIN
            ? "Admin Dashboard"
            : "Customer Dashboard";
    const navLink =
        user?.role === EnumUserRole.ADMIN ? adminNavlink : customerNavlink;
    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="mb-4">
                        {label}
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navLink.map((nav) => {
                                return (
                                    <React.Fragment key={nav.title}>
                                        {nav.title && nav.url ? (
                                            <SidebarMenuItem>
                                                <SidebarMenuButton
                                                    asChild
                                                    className={cn(
                                                        nav.url === pathname
                                                            ? "bg-accent text-accent-foreground"
                                                            : "",
                                                    )}
                                                >
                                                    <Link href={nav.url}>
                                                        {nav.icon && (
                                                            <nav.icon />
                                                        )}
                                                        {nav.title}
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        ) : (
                                            <SidebarMenuItem>
                                                <SidebarMenuButton
                                                    className={cn(
                                                        nav.url === pathname
                                                            ? "bg-accent text-accent-foreground"
                                                            : "",
                                                    )}
                                                >
                                                    {nav.icon && <nav.icon />}
                                                    {nav.title}
                                                </SidebarMenuButton>
                                                <SidebarMenuSub>
                                                    {nav?.children?.map(
                                                        (sub) => (
                                                            <SidebarMenuSubItem
                                                                key={sub?.title}
                                                            >
                                                                <SidebarMenuSubButton
                                                                    asChild
                                                                    className={cn(
                                                                        sub?.url ===
                                                                            pathname
                                                                            ? "bg-accent text-accent-foreground"
                                                                            : "",
                                                                    )}
                                                                >
                                                                    <Link
                                                                        href={
                                                                            sub?.url
                                                                        }
                                                                    >
                                                                        {
                                                                            sub.title
                                                                        }
                                                                    </Link>
                                                                </SidebarMenuSubButton>
                                                            </SidebarMenuSubItem>
                                                        ),
                                                    )}
                                                </SidebarMenuSub>
                                            </SidebarMenuItem>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
