"use client";

import { Star } from "lucide-react";

import { TRatingFacet } from "@/features/products/types/product-filter.types";
import { cn } from "@/shared/lib/utils";

type RatingFilterProps = {
    options: TRatingFacet[];
    value: string;
    onChange: (value: string) => void;
};

/**
 * "n stars and up". Single-select, because the buckets already nest — ticking
 * both 4+ and 3+ can only ever mean 3+.
 */
export default function RatingFilter({
    options,
    value,
    onChange,
}: RatingFilterProps) {
    if (options.length === 0) return null;

    return (
        <div className="border-b border-muted pb-4">
            <p className="py-2 text-sm font-semibold">Customer rating</p>

            <ul className="space-y-1">
                {options.map((option) => {
                    const isActive = value === String(option.value);

                    return (
                        <li key={option.value}>
                            <button
                                type="button"
                                aria-pressed={isActive}
                                // Clicking the active bucket clears it, so the
                                // only single-select filter still has a way out
                                // that does not need a separate "any" row.
                                onClick={() =>
                                    onChange(isActive ? "" : String(option.value))
                                }
                                className={cn(
                                    "flex w-full cursor-pointer items-center gap-2 rounded px-1 py-1 text-sm",
                                    isActive
                                        ? "bg-primary-50 text-foreground"
                                        : "text-muted-foreground hover:text-foreground",
                                )}
                            >
                                <span className="flex items-center gap-0.5">
                                    {Array.from({ length: 5 }, (_, index) => (
                                        <Star
                                            key={index}
                                            className={cn(
                                                "size-3.5",
                                                index < option.value
                                                    ? "fill-amber-400 text-amber-400"
                                                    : "text-muted-foreground/40",
                                            )}
                                        />
                                    ))}
                                </span>
                                <span className="flex-1 text-left">& up</span>
                                <span className="text-xs tabular-nums text-muted-foreground/70">
                                    {option.count}
                                </span>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
