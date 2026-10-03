"use client";

import { Package, Percent, Store, Wallet } from "lucide-react";
import Link from "next/link";

import { currencyFormatter } from "@/features/cart/utils/calculate-order-total";
import { useOrderAnalyticsQuery } from "@/features/orders/api/order.api";
import { vendorStatusMap } from "@/features/orders/constants/status-maps";
import type { TVendorStatus } from "@/features/orders/types/status.types";
import { StatusBadge } from "@/shared/ui/status-badge";
import { Skeleton } from "@/shared/ui/skeleton";

/**
 * Platform-level marketplace metrics.
 *
 * The distinction that matters here: `totalRevenue` is gross merchandise
 * value — what buyers paid in total, most of which is owed to sellers — while
 * `platformCommission` is what Trendora actually earns. Showing GMV alone as
 * "revenue" overstates income by roughly 10x at a 10% commission rate.
 */
export default function MarketplaceOverview() {
    const { data, isLoading } = useOrderAnalyticsQuery();

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {[...Array(4)].map((_, index) => (
                    <Skeleton key={index} className="h-28 rounded-2xl" />
                ))}
            </div>
        );
    }

    const analytics = data?.result;
    const overview = analytics?.overview;

    return (
        <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <Tile
                    color="#f24312"
                    icon={<Package className="text-white" />}
                    label="Orders"
                    value={String(overview?.totalOrders ?? 0)}
                    hint={`Avg ${currencyFormatter(overview?.averageOrderValue ?? 0)}`}
                />
                <Tile
                    color="#d45f87"
                    icon={<Wallet className="text-white" />}
                    label="Gross merchandise value"
                    value={currencyFormatter(overview?.totalRevenue ?? 0)}
                    hint="What buyers paid in total"
                />
                <Tile
                    color="#c3f98e"
                    icon={<Percent className="text-white" />}
                    label="Platform commission"
                    value={currencyFormatter(overview?.platformCommission ?? 0)}
                    hint="Trendora's actual earnings"
                />
                <Tile
                    color="#e560f8"
                    icon={<Store className="text-white" />}
                    label="Owed to sellers"
                    value={currencyFormatter(overview?.vendorEarnings ?? 0)}
                    hint="Vendor earnings across paid orders"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Store pipeline — makes a pending application queue visible. */}
                <div className="bg-white rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                        <h5 className="font-semibold">Stores</h5>
                        <Link
                            href="/admin/vendor-list"
                            className="text-xs text-primary hover:underline"
                        >
                            Manage
                        </Link>
                    </div>
                    {!analytics?.vendorsByStatus?.length ? (
                        <p className="text-sm text-muted-foreground">
                            No stores yet.
                        </p>
                    ) : (
                        <ul className="space-y-2">
                            {analytics.vendorsByStatus.map((row) => (
                                <li
                                    key={row.status}
                                    className="flex items-center justify-between text-sm"
                                >
                                    <StatusBadge
                                        statusMap={vendorStatusMap}
                                        status={row.status as TVendorStatus}
                                    />
                                    <span className="font-medium">
                                        {row.count}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Which sellers actually earn the platform money. */}
                <div className="bg-white rounded-2xl p-5 space-y-4">
                    <h5 className="font-semibold">
                        Top stores by commission
                    </h5>
                    {!analytics?.topVendors?.length ? (
                        <p className="text-sm text-muted-foreground">
                            No paid orders yet.
                        </p>
                    ) : (
                        <ul className="space-y-3">
                            {analytics.topVendors.slice(0, 5).map((vendor) => (
                                <li
                                    key={vendor.vendorId}
                                    className="flex items-center justify-between gap-3"
                                >
                                    <div className="min-w-0">
                                        {vendor.slug ? (
                                            <Link
                                                href={`/stores/${vendor.slug}`}
                                                className="text-sm font-medium hover:underline line-clamp-1"
                                            >
                                                {vendor.storeName}
                                            </Link>
                                        ) : (
                                            <p className="text-sm font-medium line-clamp-1">
                                                {vendor.storeName ?? "—"}
                                            </p>
                                        )}
                                        <p className="text-xs text-muted-foreground">
                                            {vendor.orders} order(s) ·{" "}
                                            {currencyFormatter(
                                                vendor.grossSales,
                                            )}{" "}
                                            gross
                                        </p>
                                    </div>
                                    <p className="text-sm font-semibold whitespace-nowrap">
                                        {currencyFormatter(vendor.commission)}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}

function Tile({
    color,
    icon,
    label,
    value,
    hint,
}: {
    color: string;
    icon: React.ReactNode;
    label: string;
    value: string;
    hint?: string;
}) {
    return (
        <div className="rounded-2xl p-5 shadow-md flex gap-x-4 items-center bg-white">
            <div
                className="size-16 polygon flex items-center justify-center shrink-0"
                style={{ backgroundColor: color }}
            >
                {icon}
            </div>
            <div className="min-w-0">
                <p className="font-normal tracking-wider text-sm text-muted-foreground line-clamp-1">
                    {label}
                </p>
                <strong className="text-lg">{value}</strong>
                {hint && (
                    <p className="text-xs text-muted-foreground line-clamp-1">
                        {hint}
                    </p>
                )}
            </div>
        </div>
    );
}
