"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/shared/ui/sidebar";
import { cn } from "@/shared/lib/utils";
import { pathMatchScore } from "@/shared/utils/match-path";

import { navLinkPaths, navLinkUrl, TSidebarLink } from "./dashboard-navlink";

type TProps = {
    navLink: TSidebarLink[];
};

export default function NavMain({ navLink }: TProps) {
    const pathname = usePathname();

    // One row per resource — a resource's list/add screens are tabs on the
    // page (see DashboardTabs), never a second row here. Only the best-scoring
    // row lights up, so "/admin" doesn't stay highlighted on "/admin/brand-list".
    const scores = navLink.map((nav) =>
        Math.max(
            0,
            ...navLinkPaths(nav).map((path) => pathMatchScore(path, pathname)),
        ),
    );
    const bestScore = Math.max(0, ...scores);
    const activeIndex = bestScore > 0 ? scores.indexOf(bestScore) : -1;

    return (
        <SidebarGroup>
            <SidebarGroupContent>
                <SidebarMenu>
                    {navLink.map((nav, index) => (
                        <SidebarMenuItem key={nav.title}>
                            <SidebarMenuButton
                                asChild
                                tooltip={nav.title}
                                className={cn(
                                    index === activeIndex
                                        ? "bg-accent text-accent-foreground"
                                        : "",
                                )}
                            >
                                <Link href={navLinkUrl(nav)}>
                                    {nav.icon && <nav.icon />}
                                    {nav.title}
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
