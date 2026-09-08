import { DataTableColumn } from "@/shared/components/table/table-types";
import {
    orderStatusMap,
    paymentStatusMap,
} from "@/features/orders/constants/status-maps";
import { TOrder } from "@/features/orders/types/order.types";
import { StatusBadge } from "@/shared/ui/status-badge";
import { formatDate } from "@/shared/lib/format-date-time";

/**
 * Buyer's order list.
 *
 * `orderStatus` is only a rollup across the stores on the order, so the row
 * also says how many parcels there are — the real per-store status is in the
 * expanded sub-rows.
 */
export const myOrderColumns = (): DataTableColumn<TOrder>[] => {
    return [
        {
            key: "orderNumber",
            header: "Order ID",
        },
        {
            key: "createdAt",
            header: "Date",
            cell: (row) => <span>{formatDate(row?.createdAt, "ll")}</span>,
        },
        {
            key: "paymentStatus",
            header: "Payment",
            cell: (row) => (
                <StatusBadge
                    statusMap={paymentStatusMap}
                    status={row?.paymentStatus}
                />
            ),
        },
        {
            key: "paymentMethod",
            header: "Method",
            cell: (row) => (
                <span>{row?.paymentMethod?.split("_")?.join(" ")}</span>
            ),
        },
        {
            key: "vendorOrders",
            header: "Stores",
            cell: (row) => {
                const count = row?.vendorOrders?.length ?? 0;
                return (
                    <span>
                        {count} {count === 1 ? "store" : "stores"}
                    </span>
                );
            },
        },
        {
            key: "items",
            header: "Items",
            cell: (row) => {
                // Items hang off each slice now; fall back to the flat list
                // for an order fetched from an endpoint that still sends it.
                const fromSlices = row?.vendorOrders?.reduce(
                    (total, slice) => total + (slice.items?.length ?? 0),
                    0,
                );
                return <span>{fromSlices || row?.items?.length || 0}</span>;
            },
        },
        {
            key: "orderStatus",
            header: "Overall",
            cell: (row) => (
                <StatusBadge
                    statusMap={orderStatusMap}
                    status={row?.orderStatus}
                />
            ),
        },
        {
            key: "shippingCost",
            header: "Shipping",
            cell: (row) => <span>${row?.shippingCost}</span>,
        },
        {
            key: "totalAmount",
            header: "Total",
            cell: (row) => <span>${row?.totalAmount}</span>,
        },
    ];
};
