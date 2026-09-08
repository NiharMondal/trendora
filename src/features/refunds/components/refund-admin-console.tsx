"use client";

import { AlertTriangle, RefreshCw, Undo2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { currencyFormatter } from "@/features/cart/utils/calculate-order-total";
import { refundStatusMap } from "@/features/orders/constants/status-maps";
import {
    useAllRefundsQuery,
    useCancelRefundMutation,
    useOutstandingRefundsQuery,
    useRetryAllRefundsMutation,
    useRetryRefundMutation,
} from "@/features/refunds/api/refund.api";
import { TRefund } from "@/features/refunds/types/refund.types";
import { DataTable, TableLoading } from "@/shared/components/table";
import { DataTableColumn } from "@/shared/components/table/table-types";
import TDButton from "@/shared/components/td-button";
import { TDModal } from "@/shared/components/td-modal";
import { formatDate } from "@/shared/lib/format-date-time";
import { useTableFilters } from "@/shared/hooks/use-table-filters";
import { Button } from "@/shared/ui/button";
import { StatusBadge } from "@/shared/ui/status-badge";
import { Textarea } from "@/shared/ui/textarea";

const apiMessage = (error: unknown) =>
    (error as { data?: { message?: string } })?.data?.message;

/**
 * Refunds console.
 *
 * A refund is issued automatically the moment a paid parcel is cancelled, so
 * the normal state of this screen is empty. It exists for the gap that
 * automation cannot close: a refund the gateway rejected, or one that was
 * never sent because the process died mid-flight. Anything sitting here is
 * money a buyer is owed and has not received.
 */
export default function RefundAdminConsole() {
    const filters = useTableFilters({ defaultSortBy: "createdAt:desc" });
    const { data: outstanding, isLoading: outstandingLoading } =
        useOutstandingRefundsQuery();
    const { data, isLoading, isFetching } = useAllRefundsQuery(
        filters.queryParams as Record<string, string>,
    );

    const [cancelTarget, setCancelTarget] = useState<TRefund | null>(null);
    const [cancelReason, setCancelReason] = useState("");

    const [retryRefund, { isLoading: isRetrying }] = useRetryRefundMutation();
    const [retryAll, { isLoading: isRetryingAll }] =
        useRetryAllRefundsMutation();
    const [cancelRefund, { isLoading: isCancelling }] =
        useCancelRefundMutation();

    const handleRetry = async (refund: TRefund) => {
        try {
            const result = await retryRefund(refund.id).unwrap();
            toast.success(
                result.result.status === "SUCCEEDED"
                    ? `Refunded ${currencyFormatter(Number(result.result.amount))}`
                    : `Refund is now ${result.result.status.toLowerCase()}`,
            );
        } catch (error) {
            // Deliberately surfaced: the operator pressed retry and needs the
            // gateway's actual reason.
            toast.error(apiMessage(error) ?? "The gateway rejected the refund");
        }
    };

    const handleRetryAll = async () => {
        try {
            const result = await retryAll().unwrap();
            toast.success(result.message);
        } catch (error) {
            toast.error(apiMessage(error) ?? "Could not retry refunds");
        }
    };

    const handleCancel = async () => {
        if (!cancelTarget) return;
        if (cancelReason.trim().length < 5) {
            toast.error("Give a reason of at least 5 characters");
            return;
        }

        try {
            await cancelRefund({
                id: cancelTarget.id,
                payload: { reason: cancelReason.trim() },
            }).unwrap();
            toast.success("Refund abandoned");
            setCancelTarget(null);
            setCancelReason("");
        } catch (error) {
            toast.error(apiMessage(error) ?? "Could not abandon this refund");
        }
    };

    const columns: DataTableColumn<TRefund>[] = [
        {
            key: "order",
            header: "Order",
            cell: (row) => (
                <div>
                    <Link
                        href={`/admin/order-details/${row.orderId}`}
                        className="font-medium hover:underline"
                    >
                        {row.order?.orderNumber ?? row.orderId.slice(0, 8)}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                        {row.order?.user?.name}
                    </p>
                </div>
            ),
        },
        {
            key: "vendorOrder",
            header: "Parcel",
            cell: (row) =>
                row.vendorOrder ? (
                    <div className="text-xs">
                        <p>{row.vendorOrder.vendorOrderNumber}</p>
                        <p className="text-muted-foreground">
                            {row.vendorOrder.vendor?.storeName}
                        </p>
                    </div>
                ) : (
                    <span className="text-xs text-muted-foreground">
                        Order-level
                    </span>
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
                <div className="space-y-1">
                    <StatusBadge
                        statusMap={refundStatusMap}
                        status={row.status}
                    />
                    {row.failureReason && (
                        <p className="text-xs text-red-600 max-w-[240px]">
                            {row.failureReason}
                        </p>
                    )}
                    {row.attempts > 1 && (
                        <p className="text-xs text-muted-foreground">
                            {row.attempts} attempts
                        </p>
                    )}
                </div>
            ),
        },
        {
            key: "gateway",
            header: "Via",
            cell: (row) => (
                <div className="text-xs">
                    <p>{row.gateway ?? "manual"}</p>
                    {row.gatewayRefundId && (
                        <p className="text-muted-foreground">
                            {row.gatewayRefundId}
                        </p>
                    )}
                </div>
            ),
        },
        {
            key: "reason",
            header: "Reason",
            cell: (row) => (
                <span className="text-xs max-w-[200px] line-clamp-2">
                    {row.reason ?? "—"}
                </span>
            ),
        },
        {
            key: "createdAt",
            header: "Raised",
            cell: (row) => (
                <div className="text-xs">
                    <p>{formatDate(row.createdAt, "ll")}</p>
                    {row.processedAt && (
                        <p className="text-muted-foreground">
                            settled {formatDate(row.processedAt, "ll")}
                        </p>
                    )}
                </div>
            ),
        },
        {
            key: "actions",
            header: "Actions",
            cell: (row) => {
                // A settled refund is final here — reversing money that has
                // already gone back is a gateway operation, not a UI one.
                if (row.status === "SUCCEEDED") {
                    return (
                        <span className="text-xs text-muted-foreground">
                            Settled
                        </span>
                    );
                }

                if (row.status === "CANCELED") {
                    return (
                        <span className="text-xs text-muted-foreground">
                            Abandoned
                        </span>
                    );
                }

                return (
                    <div className="flex items-center gap-1">
                        {/* Only a gateway refund can be retried; a manual one
                            never had a gateway to call. */}
                        {row.gateway === "stripe" && (
                            <Button
                                size="sm"
                                disabled={isRetrying}
                                onClick={() => handleRetry(row)}
                            >
                                <RefreshCw className="size-3.5" />
                                Retry
                            </Button>
                        )}
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                                setCancelTarget(row);
                                setCancelReason("");
                            }}
                        >
                            Abandon
                        </Button>
                    </div>
                );
            },
        },
    ];

    if (isLoading || outstandingLoading) return <TableLoading />;

    const owed = outstanding?.result;
    const hasOutstanding = (owed?.outstandingCount ?? 0) > 0;

    return (
        <div className="space-y-5">
            {/* The number that matters: money owed to buyers, not yet returned. */}
            <div
                className={`rounded-md p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between ${
                    hasOutstanding
                        ? "bg-red-50 border border-red-200"
                        : "bg-white"
                }`}
            >
                <div className="flex items-start gap-3">
                    {hasOutstanding && (
                        <AlertTriangle className="size-5 text-red-600 mt-0.5 shrink-0" />
                    )}
                    <div>
                        <h5 className="text-lg font-semibold">
                            {hasOutstanding
                                ? "Refunds owed to buyers"
                                : "All refunds settled"}
                        </h5>
                        <p className="text-sm text-muted-foreground">
                            {hasOutstanding
                                ? `${owed?.outstandingCount} refund(s) have not reached the buyer. Cancelled parcels are already refunded automatically — anything here failed or was never sent.`
                                : "Every cancelled parcel has had its money returned."}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-2xl font-semibold">
                            {currencyFormatter(owed?.totalOutstanding ?? 0)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            outstanding
                        </p>
                    </div>
                    {hasOutstanding && (
                        <TDButton
                            onClick={handleRetryAll}
                            isLoading={isRetryingAll}
                        >
                            <Undo2 className="size-4" />
                            Retry all
                        </TDButton>
                    )}
                </div>
            </div>

            {owed?.byStatus?.length ? (
                <div className="bg-white rounded-md p-5 flex flex-wrap gap-6">
                    {owed.byStatus.map((row) => (
                        <div key={row.status} className="space-y-1">
                            <StatusBadge
                                statusMap={refundStatusMap}
                                status={row.status}
                            />
                            <p className="text-sm">
                                <strong>{row.count}</strong> ·{" "}
                                {currencyFormatter(row.amount)}
                            </p>
                        </div>
                    ))}
                </div>
            ) : null}

            <div className="space-y-5 bg-white p-5 rounded-md">
                <div>
                    <h5 className="text-lg font-semibold">Refund ledger</h5>
                    <p className="text-sm text-muted-foreground">
                        Every attempt to return money to a buyer. Filter with
                        <code className="mx-1 text-xs">?status=FAILED</code>
                        to see only the ones that need attention.
                    </p>
                </div>

                <DataTable
                    columns={columns}
                    data={data?.result || []}
                    rowKey={(row) => row.id}
                    isFetching={isFetching}
                    filters={filters}
                    meta={data?.meta}
                    placeholder="Search refunds..."
                />
            </div>

            <TDModal
                open={!!cancelTarget}
                onOpenChange={(open) => !open && setCancelTarget(null)}
                title="Abandon this refund"
                description={
                    cancelTarget
                        ? `${currencyFormatter(Number(cancelTarget.amount))} on order ${cancelTarget.order?.orderNumber ?? ""}`
                        : undefined
                }
            >
                <div className="space-y-4">
                    <Textarea
                        value={cancelReason}
                        onChange={(event) =>
                            setCancelReason(event.target.value)
                        }
                        placeholder="Why is this refund not being paid? e.g. settled out-of-band by finance"
                        rows={3}
                    />
                    <p className="text-xs text-muted-foreground">
                        No money moves. The refund stays in the ledger marked
                        abandoned, with this reason, and stops appearing as
                        owed. Use this only when the buyer has been made whole
                        another way.
                    </p>
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setCancelTarget(null)}
                        >
                            Cancel
                        </Button>
                        <TDButton
                            variant="destructive"
                            onClick={handleCancel}
                            isLoading={isCancelling}
                        >
                            Abandon refund
                        </TDButton>
                    </div>
                </div>
            </TDModal>
        </div>
    );
}
