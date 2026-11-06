"use client";

import { PackageSearch } from "lucide-react";

import {
    topProductColumns,
    type TRankedTopProduct,
} from "@/features/analytics/components/top-product-columns";
import { useOrderAnalyticsQuery } from "@/features/orders/api/order.api";
import { DataTable } from "@/shared/components/table";

/**
 * The marketplace's ten best-selling products by units, all time.
 *
 * Reads `topProducts` from `GET /orders/analytics` with no range — the same
 * cache entry `MarketplaceOverview` uses by default, so it costs no extra
 * request. Units in cancelled parcels are not counted.
 *
 * A plain ranked list: no `filters`, `title` or `columnConfig`, so
 * `DataTable` renders no toolbar and no pagination.
 */
export default function TopProducts() {
    const { data, isFetching, error, refetch } = useOrderAnalyticsQuery();

    const rows: TRankedTopProduct[] = (data?.result.topProducts ?? []).map(
        (product, index) => ({ ...product, rank: index + 1 }),
    );

    return (
        <section
            aria-labelledby="top-products-heading"
            className="bg-white rounded-2xl p-5 lg:col-span-3 flex flex-col gap-4"
        >
            <div>
                <h4
                    id="top-products-heading"
                    className="font-semibold text-black"
                >
                    Top products
                </h4>
                <p className="text-xs text-muted-foreground">
                    All time · by units sold
                </p>
            </div>

            <DataTable
                columns={topProductColumns}
                data={rows}
                rowKey={(row) => row.productId}
                isFetching={isFetching}
                error={error}
                onRetry={refetch}
                emptyState={{
                    title: "No sales yet",
                    description:
                        "Best sellers appear here once orders come in.",
                    icon: PackageSearch,
                }}
            />
        </section>
    );
}
