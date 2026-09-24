"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { currencyFormatter } from "@/features/cart/utils/calculate-order-total";
import { payoutStatusMap } from "@/features/orders/constants/status-maps";
import { usePayoutByIdQuery } from "@/features/payouts/api/payout.api";
import { TPayout } from "@/features/payouts/types/payout.types";
import SpinnerLoading from "@/shared/components/loading/spinner-loading";
import QueryError from "@/shared/components/query-error";
import RowText from "@/shared/components/row-text";
import { DataTable } from "@/shared/components/table";
import { DataTableColumn } from "@/shared/components/table/table-types";
import { formatDate } from "@/shared/lib/format-date-time";
import { Button } from "@/shared/ui/button";
import { StatusBadge } from "@/shared/ui/status-badge";

type TPayoutParcel = NonNullable<TPayout["vendorOrders"]>[number];

const money = (value?: string | number | null) =>
    currencyFormatter(Number(value ?? 0));

const columns: DataTableColumn<TPayoutParcel>[] = [
    {
        key: "vendorOrderNumber",
        header: "Parcel",
        cell: (row) => (
            <div>
                <Link
                    href={`/vendor/orders/${row.id}`}
                    className="font-medium hover:underline"
                >
                    {row.vendorOrderNumber}
                </Link>
                <p className="text-xs text-muted-foreground">
                    Order {row.order?.orderNumber}
                </p>
            </div>
        ),
    },
    {
        key: "deliveredAt",
        header: "Delivered",
        cell: (row) =>
            row.deliveredAt ? formatDate(row.deliveredAt, "ll") : "—",
    },
    {
        key: "subtotal",
        header: "Subtotal",
        align: "right",
        cell: (row) => money(row.subtotal),
    },
    {
        key: "shippingCost",
        header: "Shipping",
        align: "right",
        cell: (row) => money(row.shippingCost),
    },
    {
        key: "commissionAmount",
        header: "Commission",
        align: "right",
        cell: (row) => (
            <span className="text-muted-foreground">
                − {money(row.commissionAmount)}
            </span>
        ),
    },
    {
        key: "vendorEarning",
        header: "You earn",
        align: "right",
        cell: (row) => (
            <span className="font-medium">{money(row.vendorEarning)}</span>
        ),
    },
];

/**
 * One settlement, and the parcels it paid for.
 *
 * `amount` is the sum of the parcels' `vendorEarning` — subtotal plus shipping
 * minus commission — so the table foots to the header. Tax never appears: it
 * is the platform's to remit and was never the store's money.
 */
export default function VendorPayoutDetails({ id }: { id: string }) {
    const { data, isLoading, error, refetch } = usePayoutByIdQuery(id);

    if (isLoading) return <SpinnerLoading />;
    if (error) {
        return (
            <QueryError
                error={error}
                onRetry={refetch}
                title="Could not load this payout"
                notFound={{
                    title: "Payout not found",
                    description:
                        "It may belong to another store, or the link is wrong.",
                }}
            />
        );
    }

    const payout = data?.result;
    if (!payout) return null;

    const parcels = payout.vendorOrders ?? [];
    const commission = parcels.reduce(
        (sum, parcel) => sum + Number(parcel.commissionAmount),
        0,
    );

    return (
        <div className="space-y-5">
            <Button variant="ghost" size="sm" asChild>
                <Link href="/vendor/payouts">
                    <ArrowLeft className="size-4" />
                    Back to payouts
                </Link>
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="bg-white rounded-md p-5 space-y-2 lg:col-span-2">
                    <div className="flex flex-wrap items-center gap-3">
                        <h3>{money(payout.amount)}</h3>
                        <StatusBadge
                            statusMap={payoutStatusMap}
                            status={payout.status}
                        />
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Earnings delivered {formatDate(payout.periodStart, "ll")}{" "}
                        → {formatDate(payout.periodEnd, "ll")} ·{" "}
                        {parcels.length} parcel(s) · commission withheld{" "}
                        {money(commission)}
                    </p>
                    {payout.failureReason && (
                        <p className="text-sm text-red-600">
                            This transfer failed: {payout.failureReason}. The
                            parcels have been released and will be included in
                            the next payout.
                        </p>
                    )}
                    {payout.notes && (
                        <p className="rounded-md bg-muted p-3 text-xs">
                            {payout.notes}
                        </p>
                    )}
                </div>

                <div className="bg-white rounded-md p-5 space-y-2 text-sm">
                    <h5 className="font-semibold">Transfer</h5>
                    <RowText
                        title="Created"
                        value={formatDate(payout.createdAt, "ll")}
                    />
                    <RowText title="Method" value={payout.method ?? "—"} />
                    <RowText
                        title="Reference"
                        value={payout.reference ?? "—"}
                    />
                    <RowText
                        title="Settled"
                        value={
                            payout.processedAt
                                ? formatDate(payout.processedAt, "ll")
                                : "—"
                        }
                    />
                </div>
            </div>

            <div className="bg-white rounded-md p-5 space-y-4">
                <h5 className="font-semibold">Parcels in this payout</h5>
                <DataTable
                    columns={columns}
                    data={parcels}
                    rowKey={(row) => row.id}
                    emptyState={{
                        title: "No parcels attached",
                        description:
                            "A failed payout releases its parcels back to your balance.",
                    }}
                />
            </div>
        </div>
    );
}
