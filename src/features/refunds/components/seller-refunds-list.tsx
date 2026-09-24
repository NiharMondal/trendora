"use client";

import { BadgeCheck, ReceiptText } from "lucide-react";
import Link from "next/link";

import { currencyFormatter } from "@/features/cart/utils/calculate-order-total";
import { refundStatusMap } from "@/features/orders/constants/status-maps";
import { useMyRefundsQuery } from "@/features/refunds/api/refund.api";
import { TRefund, TRefundStatus } from "@/features/refunds/types/refund.types";
import { DataTable } from "@/shared/components/table";
import { DataTableColumn } from "@/shared/components/table/table-types";
import { useTableFilters } from "@/shared/hooks/use-table-filters";
import { formatDate } from "@/shared/lib/format-date-time";
import { StatusBadge } from "@/shared/ui/status-badge";

/** What each state means for the seller — in every case, nothing to do. */
const SELLER_HINT: Record<TRefundStatus, string> = {
    PENDING: "Queued — Trendora sends it automatically.",
    PROCESSING: "With the payment provider.",
    SUCCEEDED: "The buyer has their money back.",
    FAILED: "The provider refused it; Trendora is retrying.",
    CANCELED: "Closed without a refund by Trendora.",
};

const columns: DataTableColumn<TRefund>[] = [
    {
        key: "vendorOrder",
        header: "Parcel",
        cell: (row) => (
            <div className="space-y-0.5">
                {row.vendorOrderId ? (
                    <Link
                        href={`/vendor/orders/${row.vendorOrderId}`}
                        className="font-medium hover:underline"
                    >
                        {row.vendorOrder?.vendorOrderNumber ?? "View parcel"}
                    </Link>
                ) : (
                    <p className="font-medium">—</p>
                )}
                <p className="text-xs text-muted-foreground">
                    Order {row.order?.orderNumber ?? "—"}
                </p>
            </div>
        ),
    },
    {
        key: "amount",
        header: "Amount",
        cell: (row) => (
            <span className="font-medium">
                {currencyFormatter(Number(row.amount))}
            </span>
        ),
    },
    {
        key: "status",
        header: "Status",
        cell: (row) => (
            <div className="max-w-xs space-y-1">
                <StatusBadge statusMap={refundStatusMap} status={row.status} />
                <p className="text-xs text-muted-foreground">
                    {SELLER_HINT[row.status]}
                </p>
            </div>
        ),
    },
    {
        key: "reason",
        header: "Reason",
        cell: (row) => (
            <span className="text-xs line-clamp-2 max-w-[220px]">
                {row.reason ?? "—"}
            </span>
        ),
    },
    {
        key: "createdAt",
        header: "Raised",
        cell: (row) => formatDate(row.createdAt, "ll"),
    },
    {
        key: "processedAt",
        header: "Completed",
        cell: (row) =>
            row.status === "SUCCEEDED" && row.processedAt
                ? formatDate(row.processedAt, "ll")
                : "—",
    },
];

/**
 * Refunds on parcels this store SOLD.
 *
 * `as: "seller"` is sent explicitly even though it is the backend's default
 * for a VENDOR, so the screen cannot silently turn into the buyer list
 * (`/dashboard/my-refunds`, `as: "buyer"`) if that default ever changes.
 *
 * Read-only by design: refunds are issued automatically when a paid parcel is
 * cancelled, and every refund mutation is admin-only. A refunded parcel's
 * earning never reaches a payout, so these amounts are not deducted from the
 * seller's balance — they were never added to it.
 */
export default function SellerRefundsList() {
    const filters = useTableFilters({
        defaultSortBy: "createdAt:desc",
        defaultFilters: { status: "" },
    });

    const { data, isFetching, error, refetch } = useMyRefundsQuery({
        ...(filters.queryParams as Record<string, string>),
        as: "seller",
    });

    return (
        <DataTable
            title="Refunds to your buyers"
            description="Issued automatically when a paid parcel from your store is cancelled."
            icon={ReceiptText}
            columns={columns}
            data={data?.result || []}
            rowKey={(row) => row.id}
            isFetching={isFetching}
            error={error}
            onRetry={refetch}
            filters={filters}
            meta={data?.meta}
            toolbarFilters={[
                {
                    key: "status",
                    label: "Status",
                    icon: BadgeCheck,
                    allLabel: "All statuses",
                    options: (Object.keys(refundStatusMap) as TRefundStatus[]).map(
                        (status) => ({
                            label: refundStatusMap[status].label,
                            value: status,
                        }),
                    ),
                },
            ]}
            // The backend searches the reason and the order / parcel number.
            placeholder="Search by order or parcel number, reason..."
            emptyState={{
                title: "No refunds",
                description:
                    "When a paid parcel from your store is cancelled, its refund shows up here.",
            }}
        />
    );
}
