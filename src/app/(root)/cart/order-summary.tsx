"use client";
import { useAppSelector } from "@/redux/redux.hooks";
import { selectCartItems } from "@/redux/slice/cartSlice";
import React from "react";

import { Button } from "@/components/ui/button";
import { envConfig } from "@/config/env-config";
import {
    calculateOrderTotals,
    currencyFormatter,
} from "@/utils/calculate-order-total";
import Link from "next/link";

export default function OrderSummary() {
    const cartItems = useAppSelector(selectCartItems);

    const { subtotal, tax, shippingCost, totalAmount } =
        calculateOrderTotals(cartItems);

    const FREE_SHIPPING_THRESHOLD = Number(envConfig.free_shipping_threshold);
    const SHIPPING_COST = Number(envConfig.shipping_cost);
    console.log(FREE_SHIPPING_THRESHOLD, SHIPPING_COST);
    const qualifiesForFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
    const freeShippingGap = FREE_SHIPPING_THRESHOLD - subtotal;
    const progressPct = Math.min(
        (subtotal / FREE_SHIPPING_THRESHOLD) * 100,
        100,
    );

    return (
        <div className="col-span-full xl:col-span-1 space-y-4 bg-white p-5 rounded-md">
            <h5 className="border-b-2 border-border uppercase text-sm tracking-wide pb-2">
                Order Summary
            </h5>

            {/* Free shipping progress bar */}
            {!qualifiesForFreeShipping ? (
                <div className="rounded-md bg-amber-50 border border-amber-200 p-3 space-y-2">
                    <p className="text-xs text-amber-700 font-medium">
                        Add{" "}
                        <span className="font-bold">
                            {currencyFormatter(freeShippingGap)}
                        </span>{" "}
                        more for free shipping!
                    </p>
                    <div className="h-1.5 rounded-full bg-amber-200 overflow-hidden">
                        <div
                            className="h-full rounded-full bg-amber-500 transition-all duration-500"
                            style={{ width: `${progressPct}%` }}
                        />
                    </div>
                </div>
            ) : (
                <div className="rounded-md bg-green-50 border border-green-200 p-3">
                    <p className="text-xs text-green-700 font-semibold">
                        🎉 You qualify for free shipping!
                    </p>
                </div>
            )}

            {/* Price rows */}
            <div className="divide-y border rounded-md text-sm">
                <SummaryRow
                    label="Subtotal"
                    value={currencyFormatter(subtotal)}
                />
                <SummaryRow
                    label="Tax (5%)"
                    value={currencyFormatter(tax)}
                    muted
                />
                <SummaryRow
                    label="Shipping"
                    value={
                        qualifiesForFreeShipping ? (
                            <span className="flex items-center gap-1.5">
                                <span className="line-through text-gray-400">
                                    {currencyFormatter(SHIPPING_COST)}
                                </span>
                                <span className="text-green-600 font-semibold">
                                    Free
                                </span>
                            </span>
                        ) : (
                            currencyFormatter(shippingCost)
                        )
                    }
                />
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
