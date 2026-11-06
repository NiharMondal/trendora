"use client";

import { BadgeCheck, ReceiptText } from "lucide-react";

import { currencyFormatter } from "@/features/cart/utils/calculate-order-total";
import { useMyRefundsQuery } from "@/features/refunds/api/refund.api";
import {
    buyerRefundStatusHint,
    buyerRefundStatusMap,
} from "@/features/refunds/constants/buyer-refund-status";
import { TRefund } from "@/features/refunds/types/refund.types";
import { DataTable } from "@/shared/components/table";
import { DataTableColumn } from "@/shared/components/table/table-types";
import { useTableFilters } from "@/shared/hooks/use-table-filters";
import { formatDate } from "@/shared/lib/format-date-time";
import { StatusBadge } from "@/shared/ui/status-badge";

const METHOD_LABEL: Record<string, string> = {
    stripe: "Original card",
    cash: "Cash",
    bank_transfer: "Bank transfer",
};

const columns: DataTableColumn<TRefund>[] = [
    {
        key: "order",
        header: "Order",
        cell: (row) => (
            <div className="space-y-0.5">
                <p className="font-medium">
                    {row.vendorOrder?.vendorOrderNumber ?? row.order?.orderNumber ?? "-"}
                </p>
                <p className="text-xs text-muted-foreground">
                    {row.vendorOrder?.vendor?.storeName
                        ? `Shipped by ${row.vendorOrder.vendor.storeName}`
                        : "Whole order"}
                </p>
            </div>
        ),
    },
    {
        key: "amount",
        header: "Amount",
        cell: (row) => (
            <span className="font-medium">{currencyFormatter(Number(row.amount))}</span>
        ),
    },
    {
        key: "status",
        header: "Status",
        cell: (row) => (
            <div className="max-w-xs space-y-1">
                <StatusBadge statusMap={buyerRefundStatusMap} status={row.status} />
                <p className="text-xs text-muted-foreground">
                    {buyerRefundStatusHint[row.status]}
                </p>
            </div>
        ),
    },
    {
        key: "gateway",
        header: "Refunded to",
        cell: (row) =>
            row.gateway ? (METHOD_LABEL[row.gateway] ?? row.gateway) : "-",
    },
    {
        key: "createdAt",
        header: "Requested",
        cell: (row) => formatDate(row.createdAt, "ll"),
    },
    {
        key: "processedAt",
        header: "Completed",
        cell: (row) =>
            row.status === "SUCCEEDED" && row.processedAt
                ? formatDate(row.processedAt, "ll")
                : "-",
    },
];

/**
 * A shopper's refunds — including a VENDOR's, on orders they placed.
 *
 * `as: "buyer"` is sent on every request: without it the backend gives a
 * VENDOR the refunds on parcels they SOLD (the seller view), not the money
 * coming back to them.
 */
export default function MyRefundsList() {
    const filters = useTableFilters({
        defaultSortBy: "createdAt:desc",
        defaultFilters: { status: "" },
    });

    const {
        data,
        isFetching,
        error: listError,
        refetch: refetchList,
    } = useMyRefundsQuery({
        ...(filters.queryParams as Record<string, string>),
        as: "buyer",
    });

    return (
        <DataTable
            title="My refunds"
            description="Money going back to you for cancelled parcels. Each store's parcel is refunded on its own."
            icon={ReceiptText}
            columns={columns}
            data={data?.result || []}
            rowKey={(row) => row.id}
            isFetching={isFetching}
            error={listError}
            onRetry={refetchList}
            filters={filters}
            meta={data?.meta}
            toolbarFilters={[
                {
                    key: "status",
                    label: "Status",
                    icon: BadgeCheck,
                    allLabel: "All statuses",
                    options: (Object.keys(buyerRefundStatusMap) as TRefund["status"][]).map(
                        (status) => ({
                            label: buyerRefundStatusMap[status].label,
                            value: status,
                        }),
                    ),
                },
            ]}
            // The backend searches the reason and the order / parcel number.
            placeholder="Search by order or parcel number..."
            emptyState={{
                title: "No refunds",
                description:
                    "When you cancel a paid parcel, its refund shows up here.",
            }}
        />
    );
}
