"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
    Banknote,
    Boxes,
    Package,
    Star,
    Store,
    TrendingUp,
    Wallet,
} from "lucide-react";

import { currencyFormatter } from "@/features/cart/utils/calculate-order-total";
import { orderStatusMap, productStatusMap } from "@/features/orders/constants/status-maps";
import { useVendorDashboardQuery } from "@/features/vendors/api/vendor.api";
import VendorSalesTrend from "@/features/vendors/components/vendor-sales-trend";
import SpinnerLoading from "@/shared/components/loading/spinner-loading";
import NoDataFound from "@/shared/components/no-data-found";
import QueryError from "@/shared/components/query-error";
import {
    getApiErrorMessage,
    getApiErrorStatus,
} from "@/shared/utils/api-error";
import { Button } from "@/shared/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/ui/select";
import { StatusBadge } from "@/shared/ui/status-badge";
import type { TOrderStatus, TProductModerationStatus } from "@/shared/types/status.types";

const RANGES = [
    { value: "all", label: "All time", days: null },
    { value: "7", label: "Last 7 days", days: 7 },
    { value: "30", label: "Last 30 days", days: 30 },
    { value: "90", label: "Last 90 days", days: 90 },
    { value: "365", label: "Last 12 months", days: 365 },
] as const;

type TRangeValue = (typeof RANGES)[number]["value"];

/**
 * The query args for a range, computed ONCE when it is picked. Building them
 * during render would put a fresh `new Date()` in the cache key every render,
 * and RTK Query would refetch in a loop.
 */
const rangeParams = (value: TRangeValue): Record<string, string> | undefined => {
    const days = RANGES.find((range) => range.value === value)?.days;
    if (!days) return undefined;

    // The backend buckets the trend by UTC day, so the window starts at UTC
    // midnight. A local midnight lands mid-way through a UTC day and "last 7
    // days" came back as 8 points, the first one partial.
    const end = new Date();
    const start = new Date(
        Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate() - (days - 1)),
    );
    return { startDate: start.toISOString(), endDate: end.toISOString() };
};

/**
 * The seller's overview.
 *
 * Every figure here is the store's own: `netEarnings` already has the
 * platform's commission and the buyer's tax taken out, so it is what the store
 * will actually be paid — not gross sales.
 */
export default function VendorDashboard() {
    const router = useRouter();
    const [range, setRange] = useState<{
        value: TRangeValue;
        params?: Record<string, string>;
    }>({ value: "all" });
    const { data, isLoading, isFetching, error, refetch } =
        useVendorDashboardQuery(range.params);

    if (isLoading) return <SpinnerLoading />;

    // The backend answers 403 with an actionable message for every store that
    // is not approved yet — none, pending, rejected (with the reason) or
    // suspended — so show that message verbatim. Anything else is a real
    // failure: telling an approved seller to "apply" because the network
    // blipped was the old behaviour.
    if (getApiErrorStatus(error) === 403) {
        return (
            <NoDataFound
                icon={Store}
                title="No active store"
                description={getApiErrorMessage(error)}
                actionLabel="Go to seller application"
                onAction={() => router.push("/vendor/apply")}
            />
        );
    }
    if (error) {
        return (
            <QueryError
                error={error}
                onRetry={refetch}
                title="Could not load your dashboard"
            />
        );
    }

    const dashboard = data?.result;
    if (!dashboard) return null;

    const {
        store,
        overview,
        ordersByStatus,
        productsByStatus,
        topProducts,
        salesTrend,
    } = dashboard;
    const rangeLabel =
        RANGES.find((option) => option.value === range.value)?.label ?? "";

    return (
        <div className="space-y-5">
            {/* Store header */}
            <div className="bg-white rounded-md p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                    <h2>{store.storeName}</h2>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <Link
                            href={`/stores/${store.slug}`}
                            className="hover:underline"
                        >
                            /stores/{store.slug}
                        </Link>
                        {store.averageRating ? (
                            <span className="flex items-center gap-1">
                                <Star className="size-3.5 fill-amber-400 text-amber-400" />
                                {Number(store.averageRating).toFixed(1)} (
                                {store.totalReviews})
                            </span>
                        ) : (
                            <span>No reviews yet</span>
                        )}
                        <span>
                            Commission {(store.commissionRate * 100).toFixed(1)}%
                        </span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button asChild>
                        <Link href="/vendor/products/add">Add product</Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/vendor/orders">View orders</Link>
                    </Button>
                </div>
            </div>

            {/* Everything below is scoped to this range except "Ready for
                payout", which is a balance, not a period figure. */}
            <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-muted-foreground">
                    {range.value === "all"
                        ? "Showing all-time figures."
                        : `Showing ${rangeLabel.toLowerCase()}.`}
                </p>
                <Select
                    value={range.value}
                    onValueChange={(value: TRangeValue) =>
                        setRange({ value, params: rangeParams(value) })
                    }
                >
                    <SelectTrigger
                        className="w-40 bg-white"
                        aria-label="Date range"
                        aria-busy={isFetching}
                    >
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {RANGES.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Money */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                <StatCard
                    icon={<TrendingUp className="size-5" />}
                    label="Gross sales"
                    value={currencyFormatter(overview.grossSales)}
                    hint="What buyers paid, including tax and shipping"
                />
                <StatCard
                    icon={<Wallet className="size-5" />}
                    label="Net earnings"
                    value={currencyFormatter(overview.netEarnings)}
                    hint="After commission — what you are actually paid"
                    highlight
                />
                <StatCard
                    icon={<Banknote className="size-5" />}
                    label="Ready for payout"
                    value={currencyFormatter(overview.pendingPayoutAmount)}
                    hint={`${overview.pendingPayoutOrders} delivered order(s) · current balance`}
                />
                <StatCard
                    icon={<Package className="size-5" />}
                    label="Orders"
                    value={String(overview.totalOrders)}
                    hint={`Avg ${currencyFormatter(overview.averageOrderValue)}`}
                />
            </div>

            <VendorSalesTrend
                points={salesTrend ?? []}
                // With no range the headline is all-time but the series is
                // the backend's default 30-day window, so say which.
                caption={range.value === "all" ? "Last 30 days" : rangeLabel}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Order pipeline */}
                <div className="bg-white rounded-md p-5 space-y-4">
                    <h5 className="font-semibold">Orders by status</h5>
                    {ordersByStatus.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            No orders yet.
                        </p>
                    ) : (
                        <ul className="space-y-2">
                            {ordersByStatus.map((row) => (
                                <li
                                    key={row.status}
                                    className="flex items-center justify-between text-sm"
                                >
                                    <StatusBadge
                                        statusMap={orderStatusMap}
                                        status={row.status as TOrderStatus}
                                    />
                                    <span className="font-medium">
                                        {row.count}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Catalogue pipeline */}
                <div className="bg-white rounded-md p-5 space-y-4">
                    <h5 className="font-semibold flex items-center gap-2">
                        <Boxes className="size-4" />
                        Listings by status
                    </h5>
                    {productsByStatus.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            No products yet.
                        </p>
                    ) : (
                        <ul className="space-y-2">
                            {productsByStatus.map((row) => (
                                <li
                                    key={row.status}
                                    className="flex items-center justify-between text-sm"
                                >
                                    <StatusBadge
                                        statusMap={productStatusMap}
                                        status={
                                            row.status as TProductModerationStatus
                                        }
                                    />
                                    <span className="font-medium">
                                        {row.count}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                    <p className="text-xs text-muted-foreground">
                        Only approved and published listings appear on the
                        storefront.
                    </p>
                </div>

                {/* Best sellers */}
                <div className="bg-white rounded-md p-5 space-y-4">
                    <h5 className="font-semibold">Top products</h5>
                    {topProducts.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            No sales yet.
                        </p>
                    ) : (
                        <ul className="space-y-3">
                            {topProducts.slice(0, 5).map((product) => (
                                <li
                                    key={product.productId}
                                    className="space-y-0.5"
                                >
                                    <p className="text-sm font-medium line-clamp-1">
                                        {product.productName}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {product.quantitySold} sold ·{" "}
                                        {currencyFormatter(product.revenue)}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* Commission is worth stating plainly so the gap between gross
                and net is never a surprise. */}
            <div className="bg-white rounded-md p-5 text-sm text-muted-foreground">
                Trendora keeps{" "}
                <strong className="text-foreground">
                    {(store.commissionRate * 100).toFixed(1)}%
                </strong>{" "}
                of your merchandise subtotal (
                {currencyFormatter(overview.commissionPaid)} so far). You keep
                the shipping you charge; tax is collected and remitted by the
                platform.
            </div>
        </div>
    );
}

function StatCard({
    icon,
    label,
    value,
    hint,
    highlight,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    hint?: string;
    highlight?: boolean;
}) {
    return (
        <div
            className={`bg-white rounded-md p-5 space-y-2 ${highlight ? "ring-1 ring-primary/30" : ""}`}
        >
            <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-sm">{label}</span>
                {icon}
            </div>
            <p className="text-2xl font-semibold">{value}</p>
            {hint && (
                <p className="text-xs text-muted-foreground">{hint}</p>
            )}
        </div>
    );
}
