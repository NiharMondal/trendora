"use client";

import { useEffect, useRef, useState } from "react";
import { Slider } from "react-slider-range";

import { currencyFormatter } from "@/features/cart/utils/calculate-order-total";

type PriceFilterProps = {
    /** The range that exists in the current result set, from the server. */
    bounds: { min: number; max: number };
    min: string;
    max: string;
    onApply: (min: string, max: string) => void;
};

type Range = [number, number];

/** A URL value inside the bounds, or the bound itself when unset/garbage. */
const toValue = (raw: string, fallback: number, bounds: Range) => {
    const n = Number(raw);
    if (raw === "" || Number.isNaN(n)) return fallback;
    return Math.min(bounds[1], Math.max(bounds[0], n));
};

/**
 * Price range slider, applied on release (`onChangeCommitted`), never per
 * movement: dragging fires `onChange` on every pixel and each would be a
 * refetch.
 *
 * The bounds come from the facet response, computed with the price filter
 * itself left out, so the slider can always be dragged back out to the full
 * range. They are the range of the price the shopper is actually shown.
 */
export default function PriceFilter({
    bounds,
    min,
    max,
    onApply,
}: PriceFilterProps) {
    const limits: Range = [bounds.min, bounds.max];
    // One price in the whole result set: the slider would divide by zero, and
    // there is nothing to drag between anyway.
    const canSlide = bounds.max > bounds.min;

    const [draft, setDraft] = useState<Range>([
        toValue(min, bounds.min, limits),
        toValue(max, bounds.max, limits),
    ]);

    // The URL is the source of truth: a reset or a chip removal has to move
    // the thumbs, and the slider is not remounted when it happens.
    useEffect(() => {
        setDraft([
            toValue(min, bounds.min, [bounds.min, bounds.max]),
            toValue(max, bounds.max, [bounds.min, bounds.max]),
        ]);
    }, [min, max, bounds.min, bounds.max]);

    // The package hands `onChangeCommitted` the value from BEFORE a keyboard
    // step, so commit from the latest `onChange` value instead.
    const latest = useRef<Range>(draft);
    latest.current = draft;

    // The package renders its thumbs without a label; name them so a screen
    // reader announces more than "slider, slider".
    const sliderRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const thumbs = sliderRef.current?.querySelectorAll('[role="slider"]');
        thumbs?.[0]?.setAttribute("aria-label", "Minimum price");
        thumbs?.[1]?.setAttribute("aria-label", "Maximum price");
    }, [canSlide]);

    /**
     * A thumb sitting on its bound is "no limit", not a limit that happens to
     * equal today's cheapest item — so a full-range slider is no filter at all.
     */
    const handleCommit = () => {
        const [lo, hi] = latest.current;
        onApply(
            lo <= bounds.min ? "" : String(lo),
            hi >= bounds.max ? "" : String(hi),
        );
    };

    return (
        <div className="border-b border-muted pb-4">
            <div className="flex items-baseline justify-between py-2">
                <p className="text-sm font-semibold">Price</p>
                <p className="text-xs font-medium text-primary-600 tabular-nums">
                    {canSlide
                        ? `${currencyFormatter(draft[0])} – ${currencyFormatter(draft[1])}`
                        : currencyFormatter(bounds.min)}
                </p>
            </div>

            {canSlide && (
                // Track and thumbs take the theme's primary scale through the
                // package's CSS variables; px-2 keeps the thumbs (centred on
                // the ends) inside the panel.
                <div className="px-2 pt-3 pb-1 [--slider-focus-ring-1:var(--color-primary-500)] [--slider-focus-ring-2:var(--color-primary-100)] [--slider-range-bg:var(--color-primary-500)] [--slider-track-bg:var(--color-muted)]">
                    <Slider
                        ref={sliderRef}
                        min={bounds.min}
                        max={bounds.max}
                        value={draft}
                        onChange={setDraft}
                        onChangeCommitted={handleCommit}
                        showTooltip
                        formatTooltip={(value) => currencyFormatter(value)}
                        trackClassName="h-1.5"
                        thumbClassName="size-4 border-2 bg-white shadow-sm transition-shadow hover:shadow-md active:cursor-grabbing"
                    />
                </div>
            )}
        </div>
    );
}
