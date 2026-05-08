"use client";

import React from "react";

import {
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
import { cn } from "@/lib/utils";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TSidebarLink } from "./dashboard-navlink";

type TProps = {
    label: string;
    navLink: TSidebarLink[];
};

export default function NavMain({ label, navLink }: TProps) {
    const pathname = usePathname();
    return (
        <SidebarGroup>
            <SidebarGroupLabel className="mb-4">{label}</SidebarGroupLabel>
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
                                                {nav.icon && <nav.icon />}
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
                                            {nav?.children?.map((sub) => (
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
                                                        <Link href={sub?.url}>
                                                            {sub.title}
                                                        </Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    </SidebarMenuItem>
                                )}
                            </React.Fragment>
                        );
                    })}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
