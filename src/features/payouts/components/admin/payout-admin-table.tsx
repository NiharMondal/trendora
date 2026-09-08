"use client";

import { useState } from "react";
import { toast } from "sonner";

import { currencyFormatter } from "@/features/cart/utils/calculate-order-total";
import { payoutStatusMap } from "@/features/orders/constants/status-maps";
import {
    useAllPayoutsQuery,
    useMarkPayoutFailedMutation,
    useMarkPayoutPaidMutation,
} from "@/features/payouts/api/payout.api";
import { TPayout } from "@/features/payouts/types/payout.types";
import { DataTable, TableLoading } from "@/shared/components/table";
import { DataTableColumn } from "@/shared/components/table/table-types";
import TDButton from "@/shared/components/td-button";
import { TDModal } from "@/shared/components/td-modal";
import { formatDate } from "@/shared/lib/format-date-time";
import { useTableFilters } from "@/shared/hooks/use-table-filters";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { StatusBadge } from "@/shared/ui/status-badge";
import { Textarea } from "@/shared/ui/textarea";

const apiMessage = (error: unknown) =>
    (error as { data?: { message?: string } })?.data?.message;

/** Every payout run, and the controls to settle or fail one. */
export default function PayoutAdminTable() {
    const filters = useTableFilters({ defaultSortBy: "createdAt:desc" });
    const { data, isLoading, isFetching } = useAllPayoutsQuery(
        filters.queryParams as Record<string, string>,
    );

    const [paidTarget, setPaidTarget] = useState<TPayout | null>(null);
    const [failTarget, setFailTarget] = useState<TPayout | null>(null);
    const [reference, setReference] = useState("");
    const [failureReason, setFailureReason] = useState("");

    const [markPaid, { isLoading: isMarkingPaid }] = useMarkPayoutPaidMutation();
    const [markFailed, { isLoading: isMarkingFailed }] =
        useMarkPayoutFailedMutation();

    const handleMarkPaid = async () => {
        if (!paidTarget) return;
        if (reference.trim().length < 3) {
            toast.error("Enter the transfer reference");
            return;
        }

        try {
            await markPaid({
                id: paidTarget.id,
                payload: { reference: reference.trim() },
            }).unwrap();
            toast.success("Payout marked as paid");
            setPaidTarget(null);
            setReference("");
        } catch (error) {
            toast.error(apiMessage(error) ?? "Could not mark this payout paid");
        }
    };

    const handleMarkFailed = async () => {
        if (!failTarget) return;
        if (failureReason.trim().length < 5) {
            toast.error("Enter a failure reason");
            return;
        }

        try {
            await markFailed({
                id: failTarget.id,
                payload: { failureReason: failureReason.trim() },
            }).unwrap();
            toast.success(
                "Payout marked failed — its earnings are back in the pool",
            );
            setFailTarget(null);
            setFailureReason("");
        } catch (error) {
            toast.error(apiMessage(error) ?? "Could not fail this payout");
        }
    };

    const columns: DataTableColumn<TPayout>[] = [
        {
            key: "vendor",
            header: "Store",
            cell: (row) => (
                <div>
                    <p className="font-medium">
                        {row.vendor?.storeName ?? "—"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {row.vendor?.businessEmail}
                    </p>
                </div>
            ),
        },
        {
            key: "amount",
            header: "Amount",
            cell: (row) => (
                <div>
                    <p className="font-medium">
                        {currencyFormatter(Number(row.amount))}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {row._count?.vendorOrders ?? 0} order(s)
                    </p>
                </div>
            ),
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
            key: "status",
            header: "Status",
            cell: (row) => (
                <div className="space-y-1">
                    <StatusBadge
                        statusMap={payoutStatusMap}
                        status={row.status}
                    />
                    {row.failureReason && (
                        <p className="text-xs text-red-600 max-w-[200px]">
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
                <span className="text-xs">{row.reference ?? "—"}</span>
            ),
        },
        {
            key: "createdAt",
            header: "Created",
            cell: (row) => <span>{formatDate(row.createdAt, "ll")}</span>,
        },
        {
            key: "actions",
            header: "Actions",
            cell: (row) => {
                // A settled payout is final here — reversing it is a gateway
                // operation, not a UI one.
                if (row.status === "PAID") {
                    return (
                        <span className="text-xs text-muted-foreground">
                            Settled{" "}
                            {row.processedAt
                                ? formatDate(row.processedAt, "ll")
                                : ""}
                        </span>
                    );
                }

                return (
                    <div className="flex items-center gap-1">
                        <Button
                            size="sm"
                            onClick={() => {
                                setPaidTarget(row);
                                setReference("");
                            }}
                        >
                            Mark paid
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                                setFailTarget(row);
                                setFailureReason("");
                            }}
                        >
                            Mark failed
                        </Button>
                    </div>
                );
            },
        },
    ];

    if (isLoading) return <TableLoading />;

    return (
        <div className="space-y-5 bg-white p-5 rounded-md">
            <div>
                <h5 className="text-lg font-semibold">Payout history</h5>
                <p className="text-sm text-muted-foreground">
                    Every settlement run across all stores.
                </p>
            </div>

            <DataTable
                columns={columns}
                data={data?.result || []}
                rowKey={(row) => row.id}
                isFetching={isFetching}
                filters={filters}
                meta={data?.meta}
                placeholder="Search payouts..."
            />

            <TDModal
                open={!!paidTarget}
                onOpenChange={(open) => !open && setPaidTarget(null)}
                title="Mark payout as paid"
                description={paidTarget?.vendor?.storeName ?? undefined}
            >
                <div className="space-y-4">
                    <p className="text-sm">
                        Confirming{" "}
                        <strong>
                            {currencyFormatter(Number(paidTarget?.amount ?? 0))}
                        </strong>{" "}
                        was transferred.
                    </p>
                    <Input
                        value={reference}
                        onChange={(event) => setReference(event.target.value)}
                        placeholder="Bank / gateway reference"
                    />
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setPaidTarget(null)}
                        >
                            Cancel
                        </Button>
                        <TDButton
                            onClick={handleMarkPaid}
                            isLoading={isMarkingPaid}
                        >
                            Mark paid
                        </TDButton>
                    </div>
                </div>
            </TDModal>

            <TDModal
                open={!!failTarget}
                onOpenChange={(open) => !open && setFailTarget(null)}
                title="Mark payout as failed"
                description={failTarget?.vendor?.storeName ?? undefined}
            >
                <div className="space-y-4">
                    <Textarea
                        value={failureReason}
                        onChange={(event) =>
                            setFailureReason(event.target.value)
                        }
                        placeholder="What went wrong at the bank?"
                        rows={3}
                    />
                    <p className="text-xs text-muted-foreground">
                        The attached earnings are released back into the pool so
                        the next run can pick them up.
                    </p>
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setFailTarget(null)}
                        >
                            Cancel
                        </Button>
                        <TDButton
                            variant="destructive"
                            onClick={handleMarkFailed}
                            isLoading={isMarkingFailed}
                        >
                            Mark failed
                        </TDButton>
                    </div>
                </div>
            </TDModal>
        </div>
    );
}
