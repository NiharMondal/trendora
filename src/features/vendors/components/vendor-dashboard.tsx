"use client";

import Link from "next/link";
import {
    Banknote,
    Boxes,
    Package,
    Star,
    TrendingUp,
    Wallet,
} from "lucide-react";

import { currencyFormatter } from "@/features/cart/utils/calculate-order-total";
import { orderStatusMap, productStatusMap } from "@/features/orders/constants/status-maps";
import { useVendorDashboardQuery } from "@/features/vendors/api/vendor.api";
import SpinnerLoading from "@/shared/components/loading/spinner-loading";
import NoDataFound from "@/shared/components/no-data-found";
import { Button } from "@/shared/ui/button";
import { StatusBadge } from "@/shared/ui/status-badge";
import type { TOrderStatus, TProductModerationStatus } from "@/features/orders/types/status.types";

/**
 * The seller's overview.
 *
 * Every figure here is the store's own: `netEarnings` already has the
 * platform's commission and the buyer's tax taken out, so it is what the store
 * will actually be paid — not gross sales.
 */
export default function VendorDashboard() {
    const { data, isLoading, isError } = useVendorDashboardQuery();

    if (isLoading) return <SpinnerLoading />;

    const dashboard = data?.result;

    if (isError || !dashboard) {
        return (
            <NoDataFound
                title="No store yet"
                description="Apply to sell on Trendora to get a seller dashboard."
                actionLabel="Apply now"
            />
        );
    }

    const { store, overview, ordersByStatus, productsByStatus, topProducts } =
        dashboard;

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
                    <Link href="/vendor/products/add">
                        <Button>Add product</Button>
                    </Link>
                    <Link href="/vendor/orders">
                        <Button variant="outline">View orders</Button>
                    </Link>
                </div>
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
                    hint={`${overview.pendingPayoutOrders} delivered order(s)`}
                />
                <StatCard
                    icon={<Package className="size-5" />}
                    label="Orders"
                    value={String(overview.totalOrders)}
                    hint={`Avg ${currencyFormatter(overview.averageOrderValue)}`}
                />
            </div>

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
