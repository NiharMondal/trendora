"use client";

import { useEffect, useState } from "react";

import { currencyFormatter } from "@/features/cart/utils/calculate-order-total";
import TDButton from "@/shared/components/td-button";
import { Input } from "@/shared/ui/input";

type PriceFilterProps = {
    /** The range that exists in the current result set, from the server. */
    bounds: { min: number; max: number };
    min: string;
    max: string;
    onApply: (min: string, max: string) => void;
};

/**
 * Min/max price, applied on submit rather than per keystroke.
 *
 * A number input fires on every digit, so live-applying would refetch on "1",
 * "12", "120" and, worse, briefly filter to `minPrice=1` on the way to 100.
 * The bounds come from the facet response and are the range of the price the
 * shopper is actually shown — the discounted one where there is a discount.
 */
export default function PriceFilter({
    bounds,
    min,
    max,
    onApply,
}: PriceFilterProps) {
    const [draftMin, setDraftMin] = useState(min);
    const [draftMax, setDraftMax] = useState(max);

    // The URL is the source of truth: a reset or a chip removal has to show up
    // in these inputs, and they are not remounted when it happens.
    useEffect(() => setDraftMin(min), [min]);
    useEffect(() => setDraftMax(max), [max]);

    const handleApply = () => {
        // Swapped bounds return nothing at all, which reads as a broken page.
        const from = Number(draftMin);
        const to = Number(draftMax);
        const isSwapped =
            draftMin !== "" && draftMax !== "" && from > to;

        onApply(
            isSwapped ? draftMax : draftMin,
            isSwapped ? draftMin : draftMax,
        );
    };

    return (
        <div className="border-b border-muted pb-4">
            <p className="py-2 text-sm font-semibold">Price</p>

            <p className="pb-2 text-xs text-muted-foreground">
                {currencyFormatter(bounds.min)} – {currencyFormatter(bounds.max)}
            </p>

            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    handleApply();
                }}
                className="space-y-2"
            >
                <div className="flex items-center gap-2">
                    <Input
                        type="number"
                        inputMode="numeric"
                        min={0}
                        aria-label="Minimum price"
                        placeholder={String(bounds.min)}
                        value={draftMin}
                        onChange={(event) => setDraftMin(event.target.value)}
                        className="h-9"
                    />
                    <span className="text-muted-foreground">–</span>
                    <Input
                        type="number"
                        inputMode="numeric"
                        min={0}
                        aria-label="Maximum price"
                        placeholder={String(bounds.max)}
                        value={draftMax}
                        onChange={(event) => setDraftMax(event.target.value)}
                        className="h-9"
                    />
                </div>

                <TDButton
                    type="submit"
                    size="sm"
                    variant="outline"
                    className="w-full"
                >
                    Apply
                </TDButton>
            </form>
        </div>
    );
}
