"use client";

import { useState } from "react";

import { orderStatusMap, paymentStatusMap } from "@/features/orders/constants/status-maps";
import type { TOrderStatus, TPaymentStatus } from "@/features/orders/types/status.types";
import { useMyVendorOrdersQuery } from "@/features/vendors/api/vendor-order.api";
import { TVendorOrder } from "@/features/vendors/types/vendor-order.types";
import { DataTable, TableLoading } from "@/shared/components/table";
import { DataTableColumn } from "@/shared/components/table/table-types";
import { formatDate } from "@/shared/lib/format-date-time";
import { useTableFilters } from "@/shared/hooks/use-table-filters";
import { Button } from "@/shared/ui/button";
import { StatusBadge } from "@/shared/ui/status-badge";

import VendorOrderStatusModal, {
    STATUS_ACTION_LABELS,
    VENDOR_TRANSITIONS,
} from "./vendor-order-status-modal";

/**
 * The seller's order queue.
 *
 * Rows are VendorOrders — this seller's parcels — not whole orders. A vendor
 * never sees what the buyer bought from other stores.
 */
export default function VendorOrderTable() {
    const filters = useTableFilters({ defaultSortBy: "createdAt:desc" });
    const { data, isLoading, isFetching } = useMyVendorOrdersQuery(
        filters.queryParams as Record<string, string>,
    );

    const [target, setTarget] = useState<{
        vendorOrder: TVendorOrder;
        nextStatus: TOrderStatus;
    } | null>(null);

    const columns: DataTableColumn<TVendorOrder>[] = [
        {
            key: "vendorOrderNumber",
            header: "Parcel",
            cell: (row) => (
                <div>
                    <p className="font-medium">{row.vendorOrderNumber}</p>
                    <p className="text-xs text-muted-foreground">
                        Order {row.order?.orderNumber}
                    </p>
                </div>
            ),
        },
        {
            key: "customer",
            header: "Customer",
            cell: (row) => (
                <div>
                    <p className="text-sm">{row.order?.user?.name ?? "—"}</p>
                    {row.order?.user?.phone && (
                        <p className="text-xs text-muted-foreground">
                            {row.order.user.phone}
                        </p>
                    )}
                </div>
            ),
        },
        {
            key: "items",
            header: "Items",
            cell: (row) => (
                <div className="space-y-0.5 max-w-[240px]">
                    {row.items?.map((item) => (
                        <p key={item.id} className="text-xs line-clamp-1">
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
            key: "totalAmount",
            header: "Parcel total",
            cell: (row) => (
                <div className="text-sm">
                    <p>${row.totalAmount}</p>
                    {/* What the seller actually keeps, after commission. */}
                    <p className="text-xs text-success">
                        You earn ${row.vendorEarning}
                    </p>
                </div>
            ),
        },
        {
            key: "paymentStatus",
            header: "Payment",
            cell: (row) => (
                <div className="space-y-1">
                    <StatusBadge
                        statusMap={paymentStatusMap}
                        status={row.order?.paymentStatus as TPaymentStatus}
                    />
                    <p className="text-xs text-muted-foreground">
                        {row.order?.paymentMethod?.split("_").join(" ")}
                    </p>
                </div>
            ),
        },
        {
            key: "orderStatus",
            header: "Status",
            cell: (row) => (
                <div className="space-y-1">
                    <StatusBadge
                        statusMap={orderStatusMap}
                        status={row.orderStatus}
                    />
                    {row.trackingNumber && (
                        <p className="text-xs text-muted-foreground">
                            {row.carrier ? `${row.carrier}: ` : ""}
                            {row.trackingNumber}
                        </p>
                    )}
                </div>
            ),
        },
        {
            key: "createdAt",
            header: "Placed",
            cell: (row) => <span>{formatDate(row.createdAt, "ll")}</span>,
        },
        {
            key: "actions",
            header: "Actions",
            cell: (row) => {
                // Only offer transitions the backend will accept for a vendor.
                const nexts = VENDOR_TRANSITIONS[row.orderStatus] ?? [];

                if (nexts.length === 0) {
                    return (
                        <span className="text-xs text-muted-foreground">
                            No action
                        </span>
                    );
                }

                return (
                    <div className="flex flex-wrap gap-1">
                        {nexts.map((next) => (
                            <Button
                                key={next}
                                size="sm"
                                variant={
                                    next === "CANCELED"
                                        ? "destructive"
                                        : "secondary"
                                }
                                onClick={() =>
                                    setTarget({
                                        vendorOrder: row,
                                        nextStatus: next,
                                    })
                                }
                            >
                                {STATUS_ACTION_LABELS[next].replace(
                                    "Mark as ",
                                    "",
                                )}
                            </Button>
                        ))}
                    </div>
                );
            },
        },
    ];

    if (isLoading) return <TableLoading />;

    return (
        <div className="space-y-5 bg-white p-5 rounded-md">
            <div>
                <h5 className="text-lg font-semibold">Orders to fulfil</h5>
                <p className="text-sm text-muted-foreground">
                    Each row is one parcel from your store. Buyers may have
                    ordered from other stores in the same checkout.
                </p>
            </div>

            <DataTable
                columns={columns}
                data={data?.result || []}
                rowKey={(row) => row.id}
                isFetching={isFetching}
                filters={filters}
                meta={data?.meta}
                placeholder="Search orders..."
            />

            {target && (
                <VendorOrderStatusModal
                    // Remount per target so the form picks up fresh defaults.
                    key={`${target.vendorOrder.id}-${target.nextStatus}`}
                    vendorOrder={target.vendorOrder}
                    nextStatus={target.nextStatus}
                    open={!!target}
                    onOpenChange={(open) => !open && setTarget(null)}
                />
            )}
        </div>
    );
}
