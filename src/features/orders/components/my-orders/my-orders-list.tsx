"use client";
import { DataTable, TableLoading } from "@/shared/components/table";
import { useGetMyOrdersQuery } from "@/features/orders/api/order.api";
import { TOrder } from "@/features/orders/types/order.types";
import { TVendorOrder } from "@/features/vendors/types/vendor-order.types";
import { useTableFilters } from "@/shared/hooks/use-table-filters";
import { orderStatusMap } from "@/features/orders/constants/status-maps";
import { StatusBadge } from "@/shared/ui/status-badge";

import { myOrderColumns } from "./my-order-columns";
import { DownloadButton, PrintButton } from "./pdf-download-print";
import VendorOrderReviewButton from "./vendor-order-review-button";

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
                columns={myOrderColumns()}
                isFetching={isFetching}
                filters={filters}
                meta={orders?.meta}
                placeholder="Search your orders..."
                expandable={{
                    getSubRows: (o) => o.vendorOrders,
                    subRowKey: (slice, o) => `${o.id}-${slice.id}`,
                    subColumns: [
                        {
                            key: "storeName",
                            header: "Store",
                            cell: (slice) => (
                                <span className="font-medium">
                                    {slice.vendor?.storeName ?? "—"}
                                </span>
                            ),
                        },
                        {
                            key: "items",
                            header: "Items",
                            cell: (slice) => (
                                <div className="space-y-0.5">
                                    {slice.items?.map((item) => (
                                        <p key={item.id} className="text-xs">
                                            {item.productName}
                                            {item.variantDetails
                                                ? ` (${item.variantDetails})`
                                                : ""}{" "}
                                            × {item.quantity}
                                        </p>
                                    ))}
                                </div>
                            ),
                        },
                        {
                            key: "orderStatus",
                            header: "Status",
                            cell: (slice) => (
                                <StatusBadge
                                    statusMap={orderStatusMap}
                                    status={slice.orderStatus}
                                />
                            ),
                        },
                        {
                            key: "trackingNumber",
                            header: "Tracking",
                            cell: (slice) =>
                                slice.trackingNumber ? (
                                    <span className="text-xs">
                                        {slice.carrier
                                            ? `${slice.carrier}: `
                                            : ""}
                                        {slice.trackingNumber}
                                    </span>
                                ) : (
                                    <span className="text-xs text-muted-foreground">
                                        —
                                    </span>
                                ),
                        },
                        {
                            key: "totalAmount",
                            header: "Parcel total",
                            cell: (slice) => <span>${slice.totalAmount}</span>,
                        },
                        {
                            key: "review",
                            header: "",
                            cell: (slice) => (
                                <VendorOrderReviewButton vendorOrder={slice} />
                            ),
                        },
                    ],
                    title: (o) => `Parcels in #${o.orderNumber}`,
                    emptyMessage: "No store parcels on this order yet.",
                    defaultExpanded: false,
                }}
            />
        </div>
    );
}
