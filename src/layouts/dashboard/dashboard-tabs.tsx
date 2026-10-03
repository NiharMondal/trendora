"use client";

import { usePathname } from "next/navigation";

import PageTabs from "@/shared/components/page-tabs";
import { EnumUserRole } from "@/features/auth/constants/user-role";
import { pathMatchScore } from "@/shared/utils/match-path";

import { getDashboardNav } from "./dashboard-navlink";

type TProps = {
    role: EnumUserRole;
};

/**
 * Renders the tab strip for whichever sidebar entry owns the current route.
 * It lives in the dashboard layout rather than in each page so a resource's
 * list and add screens pick their tabs up for free — the sidebar's `children`
 * ARE the tabs. Returns null on a route that owns no siblings.
 */
export default function DashboardTabs({ role }: TProps) {
    const pathname = usePathname();
    const { navLink } = getDashboardNav(role);

    const owner = navLink
        .filter((nav) => (nav.children?.length ?? 0) > 1)
        .map((nav) => ({
            nav,
            score: Math.max(
                0,
                ...nav.children!.map((child) =>
                    pathMatchScore(child.url, pathname),
                ),
            ),
        }))
        .reduce<{ nav: (typeof navLink)[number]; score: number } | null>(
            (best, current) =>
                current.score > (best?.score ?? 0) ? current : best,
            null,
        );

    if (!owner) return null;

    return (
        <PageTabs
            className="mb-5"
            tabs={owner.nav.children!.map((child) => ({
                label: child.title,
                href: child.url,
            }))}
        />
    );
}
