"use client";
import { DataTable, TableLoading } from "@/shared/components/table";
import { useGetMyOrdersQuery } from "@/features/orders/api/order.api";
import { TOrder } from "@/features/orders/types/order.types";
import { TVendorOrder } from "@/features/vendors/types/vendor-order.types";
import { useTableFilters } from "@/shared/hooks/use-table-filters";

import { myOrderColumns } from "./my-order-columns";
import { myParcelColumns } from "./my-parcel-columns";
import { DownloadButton, PrintButton } from "./pdf-download-print";

/**
 * The buyer's orders.
 *
 * Each order expands into one row per STORE, because that is the unit that
 * ships: one parcel can be delivered while another is still processing, and
 * each carries its own tracking number. Showing only the order-level rollup
 * would hide that.
 */
export default function MyOrdersList() {
    const filters = useTableFilters({ defaultSortBy: "createdAt:desc" });
    const {
        data: orders,
        isFetching,
        isLoading,
        error: listError,
        refetch: refetchList,
    } = useGetMyOrdersQuery(filters.queryParams as Record<string, string>);

    if (isLoading) {
        return <TableLoading />;
    }

    const orderList = orders?.result ?? [];
    const hasOrders = orderList.length > 0;

    return (
        <div className="space-y-4">
            {hasOrders && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        {orders?.meta?.totalData ?? orderList.length} order
                        {(orders?.meta?.totalData ?? orderList.length) !== 1
                            ? "s"
                            : ""}
                    </p>
                    <div className="flex items-center gap-2">
                        <PrintButton orders={orderList} />
                        <DownloadButton orders={orderList} />
                    </div>
                </div>
            )}

            <DataTable<TOrder, TVendorOrder>
                data={orderList}
                rowKey={(o) => o.id}
                error={listError}
                onRetry={refetchList}
                columns={myOrderColumns()}
                isFetching={isFetching}
                filters={filters}
                meta={orders?.meta}
                placeholder="Search by order number..."
                expandable={{
                    getSubRows: (o) => o.vendorOrders,
                    subRowKey: (slice, o) => `${o.id}-${slice.id}`,
                    subColumns: myParcelColumns(),
                    title: (o) => `Parcels in #${o.orderNumber}`,
                    emptyMessage: "No store parcels on this order yet.",
                    defaultExpanded: false,
                }}
            />
        </div>
    );
}
