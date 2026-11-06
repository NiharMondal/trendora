"use client";

import {
    Heart,
    PackageCheck,
    ReceiptText,
    ShoppingBag,
    Star,
    Truck,
    Wallet,
} from "lucide-react";
import Link from "next/link";
import React from "react";

import { useUserInfoClient } from "@/features/auth/utils/user-info";
import { currencyFormatter } from "@/features/cart/utils/calculate-order-total";
import {
    useGetMyOrdersQuery,
    useMyOrderSummaryQuery,
} from "@/features/orders/api/order.api";
import { orderStatusMap } from "@/features/orders/constants/status-maps";
import { TBuyerSummary } from "@/features/orders/types/order.types";
import { useMyWishlistQuery } from "@/features/wishlist/api/wishlist.api";
import QueryError from "@/shared/components/query-error";
import { formatDate } from "@/shared/lib/format-date-time";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";
import { StatusBadge } from "@/shared/ui/status-badge";

/**
 * The shopper's home: what they have spent, what is on its way, what is owed
 * back to them, and what to do next. Replaces a grid that repeated the
 * sidebar as cards (FE-22).
 *
 * Every figure is the caller's own PURCHASES — a VENDOR landing here sees what
 * they bought, not what they sold (that is `/vendor`).
 */
export default function BuyerDashboard() {
    const user = useUserInfoClient();
    const summaryQuery = useMyOrderSummaryQuery();
    const recentQuery = useGetMyOrdersQuery({ limit: "3" });
    const { data: wishlistData } = useMyWishlistQuery();

    const summary = summaryQuery.data?.result;
    const recent = recentQuery.data?.result ?? [];
    const wishlistCount = wishlistData?.result?.length ?? 0;

    return (
        <div className="space-y-5">
            <div>
                <h3>Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}</h3>
                <p className="text-sm text-muted-foreground">
                    Your orders, refunds and reviews at a glance.
                </p>
            </div>

            {summaryQuery.isLoading ? (
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-28 rounded-2xl" />
                    ))}
                </div>
            ) : summaryQuery.error || !summary ? (
                <QueryError
                    error={summaryQuery.error}
                    onRetry={summaryQuery.refetch}
                    title="Could not load your summary"
                    className="min-h-[200px] bg-white"
                />
            ) : (
                <>
                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                        <Stat
                            icon={<ShoppingBag />}
                            label="Orders"
                            value={String(summary.totalOrders)}
                            href="/dashboard/my-orders"
                        />
                        <Stat
                            icon={<Wallet />}
                            label="Total spent"
                            value={currencyFormatter(summary.totalSpent)}
                            hint="Paid, minus refunds received"
                        />
                        <Stat
                            icon={<Truck />}
                            label="On the way"
                            value={String(summary.parcels.inProgress)}
                            hint={
                                summary.parcels.delivered
                                    ? `${summary.parcels.delivered} delivered`
                                    : undefined
                            }
                            href="/dashboard/my-orders"
                        />
                        <Stat
                            icon={<ReceiptText />}
                            label="Refunds owed"
                            value={
                                summary.openRefunds.count
                                    ? currencyFormatter(summary.openRefunds.amount)
                                    : "None"
                            }
                            hint={
                                summary.openRefunds.count
                                    ? `${summary.openRefunds.count} in progress`
                                    : "Nothing outstanding"
                            }
                            href="/dashboard/my-refunds"
                            tone={summary.openRefunds.count ? "warning" : "default"}
                        />
                    </div>

                    <NextSteps
                        awaitingReview={summary.awaitingReview}
                        wishlistCount={wishlistCount}
                        hasOrders={summary.totalOrders > 0}
                    />
                </>
            )}

            <div className="space-y-3 rounded-2xl bg-white p-5">
                <div className="flex items-center justify-between">
                    <h4>Recent orders</h4>
                    {recent.length ? (
                        <Link href="/dashboard/my-orders" className="text-sm text-primary hover:underline">
                            View all
                        </Link>
                    ) : null}
                </div>
                {recentQuery.isLoading ? (
                    <Skeleton className="h-32 w-full" />
                ) : recentQuery.error ? (
                    <QueryError
                        error={recentQuery.error}
                        onRetry={recentQuery.refetch}
                        title="Could not load your recent orders"
                        className="min-h-[160px] border-0"
                    />
                ) : recent.length === 0 ? (
                    <div className="space-y-3 py-6 text-center">
                        <p className="text-sm text-muted-foreground">
                            You have not placed an order yet.
                        </p>
                        <Button asChild size="sm">
                            <Link href="/products">Start shopping</Link>
                        </Button>
                    </div>
                ) : (
                    <ul className="divide-y divide-muted">
                        {recent.map((order) => (
                            <li
                                key={order.id}
                                className="flex flex-wrap items-center justify-between gap-2 py-3"
                            >
                                <div>
                                    <p className="font-medium">{order.orderNumber}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {formatDate(order.createdAt, "ll")} ·{" "}
                                        {order.vendorOrders?.length ?? 0} parcel
                                        {(order.vendorOrders?.length ?? 0) === 1 ? "" : "s"}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <StatusBadge statusMap={orderStatusMap} status={order.orderStatus} />
                                    <span className="font-medium">
                                        {currencyFormatter(Number(order.totalAmount))}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

function Stat({
    icon,
    label,
    value,
    hint,
    href,
    tone = "default",
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    hint?: string;
    href?: string;
    tone?: "default" | "warning";
}) {
    const body = (
        <div
            className={cn(
                "flex h-full items-center gap-4 rounded-2xl bg-white p-5 shadow-sm transition-colors",
                href && "hover:ring-1 hover:ring-primary/40",
            )}
        >
            <span
                className={cn(
                    "flex size-12 shrink-0 items-center justify-center rounded-full [&_svg]:size-5",
                    tone === "warning"
                        ? "bg-warning-100 text-warning-700"
                        : "bg-primary-50 text-primary",
                )}
            >
                {icon}
            </span>
            <div className="min-w-0">
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="truncate text-xl font-semibold">{value}</p>
                {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
            </div>
        </div>
    );
    return href ? <Link href={href}>{body}</Link> : body;
}

/** At most three nudges, each only when it is true — unreviewed items first. */
function NextSteps({
    awaitingReview,
    wishlistCount,
    hasOrders,
}: {
    awaitingReview: TBuyerSummary["awaitingReview"];
    wishlistCount: number;
    hasOrders: boolean;
}) {
    // Product reviews are written on the product page, so each nudge links
    // straight there rather than to a list the buyer would have to dig through.
    const reviewSteps = awaitingReview.products.map((product) => ({
        icon: <Star />,
        text: `How was ${product.name}? Leave a review`,
        href: `/products/${product.slug}`,
        cta: "Review",
    }));
    const steps = [
        ...reviewSteps,
        wishlistCount > 0 && {
            icon: <Heart />,
            text: `${wishlistCount} item${wishlistCount === 1 ? "" : "s"} saved in your wishlist`,
            href: "/dashboard/wishlist",
            cta: "View",
        },
        !hasOrders && {
            icon: <PackageCheck />,
            text: "Shop across every store on Trendora and check out once.",
            href: "/products",
            cta: "Browse",
        },
    ]
        .filter(Boolean)
        .slice(0, 3) as { icon: React.ReactNode; text: string; href: string; cta: string }[];

    if (steps.length === 0) return null;

    return (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {steps.map((step) => (
                <div
                    key={step.href + step.text}
                    className="flex items-center justify-between gap-3 rounded-xl border border-muted bg-white px-4 py-3"
                >
                    <div className="flex items-center gap-3 text-sm [&_svg]:size-4 [&_svg]:text-primary">
                        {step.icon}
                        <span>{step.text}</span>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                        <Link href={step.href}>{step.cta}</Link>
                    </Button>
                </div>
            ))}
        </div>
    );
}
