"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/shared/lib/utils";
import { bestMatchIndex } from "@/shared/utils/match-path";

export type TPageTab = {
    label: string;
    href: string;
    count?: number;
};

type TProps = {
    tabs: TPageTab[];
    className?: string;
};

/**
 * A tab strip whose tabs are real routes. Nothing is toggled client-side —
 * every tab is a Link and the one matching the current pathname is lit, so a
 * "list / add" pair can stay two pages while reading as one screen. Renders
 * nothing when there is only one tab to show.
 */
export default function PageTabs({ tabs, className }: TProps) {
    const pathname = usePathname();

    if (tabs.length < 2) return null;

    const activeIndex = bestMatchIndex(
        tabs.map((tab) => tab.href),
        pathname,
    );

    return (
        <nav
            aria-label="Section"
            className={cn(
                "flex items-end gap-x-6 overflow-x-auto border-b border-muted",
                className,
            )}
        >
            {tabs.map((tab, index) => {
                const isActive = index === activeIndex;

                return (
                    <Link
                        key={tab.href}
                        href={tab.href}
                        aria-current={isActive ? "page" : undefined}
                        className={cn(
                            "flex items-center gap-x-2 whitespace-nowrap border-b-2 pb-2.5 text-sm duration-150",
                            isActive
                                ? "border-primary text-primary font-semibold"
                                : "border-transparent text-muted-foreground hover:text-foreground",
                        )}
                    >
                        {tab.label}
                        {typeof tab.count === "number" && (
                            <span
                                className={cn(
                                    "rounded-full px-2 py-0.5 text-xs font-medium",
                                    isActive
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted text-muted-foreground",
                                )}
                            >
                                {tab.count}
                            </span>
                        )}
                    </Link>
                );
            })}
        </nav>
    );
}
