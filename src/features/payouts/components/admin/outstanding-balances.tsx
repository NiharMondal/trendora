"use client";

import { Banknote } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { currencyFormatter } from "@/features/cart/utils/calculate-order-total";
import {
    useGeneratePayoutMutation,
    useOutstandingBalancesQuery,
} from "@/features/payouts/api/payout.api";
import SpinnerLoading from "@/shared/components/loading/spinner-loading";
import NoDataFound from "@/shared/components/no-data-found";
import TDButton from "@/shared/components/td-button";
import { TDModal } from "@/shared/components/td-modal";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

const apiMessage = (error: unknown) =>
    (error as { data?: { message?: string } })?.data?.message;

const toDateInput = (date: Date) => date.toISOString().slice(0, 10);

type Row = {
    vendorId: string;
    storeName: string | null;
    slug: string | null;
    orderCount: number;
    amountOwed: number;
    commissionEarned: number;
};

/**
 * The settlement queue: who the platform owes, and the button that creates a
 * payout run for one store.
 *
 * Which earnings go into a run is the server's decision (delivered + buyer
 * paid + not already attached to a payout) — the operator only picks the store
 * and the window. Re-running the same window settles nothing twice; the
 * backend returns 400 and the toast says so.
 */
export default function OutstandingBalances() {
    const { data, isLoading } = useOutstandingBalancesQuery();
    const [target, setTarget] = useState<Row | null>(null);

    const [periodStart, setPeriodStart] = useState(() => {
        const date = new Date();
        date.setDate(date.getDate() - 30);
        return toDateInput(date);
    });
    const [periodEnd, setPeriodEnd] = useState(() => toDateInput(new Date()));
    const [method, setMethod] = useState("bank_transfer");

    const [generatePayout, { isLoading: isGenerating }] =
        useGeneratePayoutMutation();

    const handleGenerate = async () => {
        if (!target) return;

        try {
            const result = await generatePayout({
                vendorId: target.vendorId,
                // The backend filters on deliveredAt, so send the full day.
                periodStart: new Date(
                    `${periodStart}T00:00:00.000Z`,
                ).toISOString(),
                periodEnd: new Date(`${periodEnd}T23:59:59.999Z`).toISOString(),
                method,
            }).unwrap();

            toast.success(
                `Payout of ${currencyFormatter(Number(result.result.amount))} created for ${target.storeName}`,
            );
            setTarget(null);
        } catch (error) {
            toast.error(apiMessage(error) ?? "Could not create that payout");
        }
    };

    if (isLoading) return <SpinnerLoading />;

    const balances = data?.result;
    const rows = balances?.vendors ?? [];

    return (
        <div className="space-y-5">
            <div className="bg-white rounded-md p-5 flex items-center justify-between">
                <div>
                    <h5 className="text-lg font-semibold">
                        Outstanding to sellers
                    </h5>
                    <p className="text-sm text-muted-foreground">
                        Delivered orders the buyer has paid for, not yet
                        settled.
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-semibold">
                        {currencyFormatter(balances?.totalOwed ?? 0)}
                    </p>
                    <p className="text-xs text-muted-foreground">total owed</p>
                </div>
            </div>

            {rows.length === 0 ? (
                <NoDataFound
                    title="Nothing to settle"
                    description="No store currently has delivered, paid orders awaiting a payout."
                    icon={Banknote}
                />
            ) : (
                <div className="bg-white rounded-md divide-y">
                    {rows.map((row) => (
                        <div
                            key={row.vendorId}
                            className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
                        >
                            <div>
                                {row.slug ? (
                                    <Link
                                        href={`/stores/${row.slug}`}
                                        className="font-medium hover:underline"
                                    >
                                        {row.storeName}
                                    </Link>
                                ) : (
                                    <p className="font-medium">
                                        {row.storeName ?? row.vendorId}
                                    </p>
                                )}
                                <p className="text-xs text-muted-foreground">
                                    {row.orderCount} delivered order(s) ·
                                    commission earned{" "}
                                    {currencyFormatter(row.commissionEarned)}
                                </p>
                            </div>

                            <div className="flex items-center gap-4">
                                <p className="text-lg font-semibold">
                                    {currencyFormatter(row.amountOwed)}
                                </p>
                                <Button size="sm" onClick={() => setTarget(row)}>
                                    Create payout
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <TDModal
                open={!!target}
                onOpenChange={(open) => !open && setTarget(null)}
                title="Create a payout run"
                description={target?.storeName ?? undefined}
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <label className="space-y-1 text-sm">
                            <span className="text-muted-foreground">
                                Period start
                            </span>
                            <Input
                                type="date"
                                value={periodStart}
                                onChange={(event) =>
                                    setPeriodStart(event.target.value)
                                }
                            />
                        </label>
                        <label className="space-y-1 text-sm">
                            <span className="text-muted-foreground">
                                Period end
                            </span>
                            <Input
                                type="date"
                                value={periodEnd}
                                onChange={(event) =>
                                    setPeriodEnd(event.target.value)
                                }
                            />
                        </label>
                    </div>

                    <label className="space-y-1 text-sm block">
                        <span className="text-muted-foreground">Method</span>
                        <Input
                            value={method}
                            onChange={(event) => setMethod(event.target.value)}
                            placeholder="bank_transfer"
                        />
                    </label>

                    <p className="text-xs text-muted-foreground">
                        Includes every delivered, paid order in that window that
                        is not already in a payout — up to{" "}
                        {currencyFormatter(target?.amountOwed ?? 0)}. Running
                        the same window twice pays nothing twice.
                    </p>

                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setTarget(null)}>
                            Cancel
                        </Button>
                        <TDButton
                            onClick={handleGenerate}
                            isLoading={isGenerating}
                        >
                            Create payout
                        </TDButton>
                    </div>
                </div>
            </TDModal>
        </div>
    );
}
