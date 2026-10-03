"use client";

import { Banknote, Clock, Wallet } from "lucide-react";

import { currencyFormatter } from "@/features/cart/utils/calculate-order-total";
import { payoutStatusMap } from "@/features/orders/constants/status-maps";
import {
    useMyBalanceQuery,
    useMyPayoutsQuery,
} from "@/features/payouts/api/payout.api";
import { TPayout } from "@/features/payouts/types/payout.types";
import { DataTable, TableLoading } from "@/shared/components/table";
import { DataTableColumn } from "@/shared/components/table/table-types";
import { formatDate } from "@/shared/lib/format-date-time";
import { useTableFilters } from "@/shared/hooks/use-table-filters";
import { StatusBadge } from "@/shared/ui/status-badge";

/**
 * The seller's money.
 *
 * Three numbers that are easy to confuse, so they are labelled explicitly:
 *   - available   — delivered, buyer paid, not yet in a payout
 *   - in fulfilment — buyer paid, but the parcel has not been delivered yet
 *   - paid out    — already settled
 *
 * Payout runs are created by the platform, not by the seller, so there is no
 * "request payout" button — that endpoint is admin-only by design.
 */
export default function VendorPayouts() {
    const filters = useTableFilters({ defaultSortBy: "createdAt:desc" });
    const { data: balanceData, isLoading: balanceLoading } = useMyBalanceQuery();
    const { data: payoutData, isLoading, isFetching } = useMyPayoutsQuery(
        filters.queryParams as Record<string, string>,
    );

    const balance = balanceData?.result;

    const columns: DataTableColumn<TPayout>[] = [
        {
            key: "createdAt",
            header: "Created",
            cell: (row) => <span>{formatDate(row.createdAt, "ll")}</span>,
        },
        {
            key: "period",
            header: "Period",
            cell: (row) => (
                <span className="text-xs">
                    {formatDate(row.periodStart, "ll")} →{" "}
                    {formatDate(row.periodEnd, "ll")}
                </span>
            ),
        },
        {
            key: "_count",
            header: "Orders",
            cell: (row) => <span>{row._count?.vendorOrders ?? 0}</span>,
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
                <div className="space-y-1">
                    <StatusBadge
                        statusMap={payoutStatusMap}
                        status={row.status}
                    />
                    {row.failureReason && (
                        <p className="text-xs text-red-600 max-w-[220px]">
                            {row.failureReason}
                        </p>
                    )}
                </div>
            ),
        },
        {
            key: "reference",
            header: "Reference",
            cell: (row) => (
                <span className="text-xs">
                    {row.reference ?? "—"}
                    {row.method ? ` (${row.method})` : ""}
                </span>
            ),
        },
        {
            key: "processedAt",
            header: "Settled",
            cell: (row) => (
                <span className="text-xs">
                    {row.processedAt ? formatDate(row.processedAt, "ll") : "—"}
                </span>
            ),
        },
    ];

    if (isLoading || balanceLoading) return <TableLoading />;

    return (
        <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <BalanceCard
                    icon={<Wallet className="size-5" />}
                    label="Available for payout"
                    value={currencyFormatter(balance?.availableForPayout ?? 0)}
                    hint={`${balance?.availableOrderCount ?? 0} delivered parcel(s)`}
                    highlight
                />
                <BalanceCard
                    icon={<Clock className="size-5" />}
                    label="Still in fulfilment"
                    value={currencyFormatter(balance?.pendingFulfilment ?? 0)}
                    hint={`${balance?.pendingFulfilmentOrderCount ?? 0} parcel(s) not yet delivered`}
                />
                <BalanceCard
                    icon={<Banknote className="size-5" />}
                    label="Paid out to date"
                    value={currencyFormatter(balance?.totalPaidOut ?? 0)}
                    hint={`${balance?.payoutCount ?? 0} payout(s)`}
                />
            </div>

            <p className="text-xs text-muted-foreground">
                Earnings become available once a parcel is delivered and the
                buyer&apos;s payment has cleared. Trendora runs settlements and
                will mark each payout paid with its bank reference.
                {balance?.commissionWithheld
                    ? ` Commission withheld on the available balance: ${currencyFormatter(balance.commissionWithheld)}.`
                    : ""}
            </p>

            <div className="space-y-5 bg-white p-5 rounded-md">
                <h5 className="text-lg font-semibold">Payout history</h5>
                <DataTable
                    columns={columns}
                    data={payoutData?.result || []}
                    rowKey={(row) => row.id}
                    isFetching={isFetching}
                    filters={filters}
                    meta={payoutData?.meta}
                    placeholder="Search payouts..."
                />
            </div>
        </div>
    );
}

function BalanceCard({
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
            {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
    );
}
