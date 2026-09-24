"use client";

import { Wallet } from "lucide-react";
import Link from "next/link";

import { currencyFormatter } from "@/features/cart/utils/calculate-order-total";
import { useMyBalanceQuery } from "@/features/payouts/api/payout.api";
import { Skeleton } from "@/shared/ui/skeleton";

/**
 * The seller's real payout balance, in the dashboard chrome.
 *
 * `availableForPayout` is money from delivered, paid parcels not yet attached
 * to a payout — commission and tax already taken out — so it is what the
 * store will actually be paid. Only mounted for a VENDOR: an admin or customer
 * has no balance, and this replaced a hardcoded "$12627" every role saw.
 *
 * Renders nothing on error. The backend 403s a store that is pending,
 * rejected or suspended, and the header is no place to explain that — the
 * vendor dashboard does (FE-06).
 */
export default function VendorBalance() {
    const { data, isLoading, isError } = useMyBalanceQuery();

    if (isLoading) return <Skeleton className="hidden h-10 w-32 md:block" />;

    const balance = data?.result;
    if (isError || !balance) return null;

    return (
        <Link
            href="/vendor/payouts"
            className="hidden items-center gap-3 rounded-full px-3 py-1.5 transition-colors hover:bg-muted md:flex"
        >
            <Wallet className="size-5 text-primary" />
            <div className="leading-tight">
                <p className="text-xs text-muted-foreground">
                    Available for payout
                </p>
                <p className="font-semibold text-foreground">
                    {currencyFormatter(balance.availableForPayout)}
                </p>
            </div>
        </Link>
    );
}
