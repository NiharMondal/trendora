"use client";
import Link from "next/link";
import React from "react";

import { selectCartItems } from "@/features/cart/store/cart.slice";
import { TCartVendorGroup } from "@/features/cart/types/cart.types";
import {
    calculateOrderTotals,
    currencyFormatter,
} from "@/features/cart/utils/calculate-order-total";
import { Button } from "@/shared/ui/button";
import { useAppSelector } from "@/store/redux.hooks";

/**
 * Cart totals.
 *
 * Shipping is charged per store, so this shows one shipping line (and one
 * free-shipping nudge) per store rather than a single cart-wide fee — that is
 * what the backend will actually charge.
 */
export default function OrderSummary() {
    const cartItems = useAppSelector(selectCartItems);

    const { vendors, subtotal, tax, shippingCost, totalAmount } =
        calculateOrderTotals(cartItems);

    const isMultiStore = vendors.length > 1;

    return (
        <div className="col-span-full xl:col-span-1 space-y-4 bg-white p-5 rounded-md">
            <h5 className="border-b-2 border-border uppercase text-sm tracking-wide pb-2">
                Order Summary
            </h5>

            {isMultiStore && (
                <p className="text-xs text-muted-foreground">
                    Your cart has items from {vendors.length} stores. Each store
                    ships separately, so shipping is charged per store.
                </p>
            )}

            {/* Per-store free-shipping progress */}
            <div className="space-y-2">
                {vendors.map((group) => (
                    <FreeShippingNudge
                        key={group.vendorId}
                        group={group}
                        showStoreName={isMultiStore}
                    />
                ))}
            </div>

            {/* Price rows */}
            <div className="divide-y border rounded-md text-sm">
                <SummaryRow
                    label="Subtotal"
                    value={currencyFormatter(subtotal)}
                />
                <SummaryRow label="Tax" value={currencyFormatter(tax)} muted />

                {/* One shipping row per store when there are several, so the
                    buyer can see where the delivery cost comes from. */}
                {isMultiStore ? (
                    vendors.map((group) => (
                        <SummaryRow
                            key={`ship-${group.vendorId}`}
                            label={`Shipping — ${group.storeName}`}
                            value={
                                group.shippingCost === 0 ? (
                                    <span className="text-green-600 font-semibold">
                                        Free
                                    </span>
                                ) : (
                                    currencyFormatter(group.shippingCost)
                                )
                            }
                        />
                    ))
                ) : (
                    <SummaryRow
                        label="Shipping"
                        value={
                            shippingCost === 0 ? (
                                <span className="text-green-600 font-semibold">
                                    Free
                                </span>
                            ) : (
                                currencyFormatter(shippingCost)
                            )
                        }
                    />
                )}

                {isMultiStore && (
                    <SummaryRow
                        label="Total shipping"
                        value={currencyFormatter(shippingCost)}
                        muted
                    />
                )}

                <SummaryRow
                    label="Total"
                    value={currencyFormatter(totalAmount)}
                    bold
                    muted
                />
            </div>

            <Link href={"/checkout"}>
                <Button className="w-full uppercase font-medium text-sm tracking-wider mt-2">
                    Proceed to Checkout
                </Button>
            </Link>
        </div>
    );
}

/** "Spend X more with this store for free shipping." */
function FreeShippingNudge({
    group,
    showStoreName,
}: {
    group: TCartVendorGroup;
    showStoreName: boolean;
}) {
    // A store with no threshold configured has nothing to progress towards.
    if (group.freeShippingThreshold <= 0) return null;

    const progressPct = Math.min(
        (group.subtotal / group.freeShippingThreshold) * 100,
        100,
    );

    if (group.qualifiesForFreeShipping) {
        return (
            <div className="rounded-md bg-green-50 border border-green-200 p-3">
                <p className="text-xs text-green-700 font-semibold">
                    🎉 Free shipping
                    {showStoreName ? ` from ${group.storeName}` : ""}!
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-md bg-amber-50 border border-amber-200 p-3 space-y-2">
            <p className="text-xs text-amber-700 font-medium">
                Add{" "}
                <span className="font-bold">
                    {currencyFormatter(group.freeShippingGap)}
                </span>{" "}
                more
                {showStoreName ? ` from ${group.storeName}` : ""} for free
                shipping!
            </p>
            <div className="h-1.5 rounded-full bg-amber-200 overflow-hidden">
                <div
                    className="h-full rounded-full bg-amber-500 transition-all duration-500"
                    style={{ width: `${progressPct}%` }}
                />
            </div>
        </div>
    );
}

function SummaryRow({
    label,
    value,
    muted,
    bold,
}: {
    label: string;
    value: React.ReactNode;
    muted?: boolean;
    bold?: boolean;
}) {
    return (
        <div
            className={`flex items-center justify-between px-3 py-2.5 ${muted ? "bg-gray-50/70" : "bg-white"}`}
        >
            <span className={bold ? "font-bold" : "text-gray-600"}>
                {label}
            </span>
            <span className={bold ? "font-bold" : "font-medium"}>{value}</span>
        </div>
    );
}
