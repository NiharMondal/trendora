"use client";

import { useState } from "react";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/ui/select";

export const DATE_RANGES = [
    { value: "all", label: "All time", days: null },
    { value: "7", label: "Last 7 days", days: 7 },
    { value: "30", label: "Last 30 days", days: 30 },
    { value: "90", label: "Last 90 days", days: 90 },
    { value: "365", label: "Last 12 months", days: 365 },
] as const;

export type TDateRangeValue = (typeof DATE_RANGES)[number]["value"];

export type TDateRange = {
    value: TDateRangeValue;
    label: string;
    /** `{ startDate, endDate }` for the query, or undefined for all time. */
    params?: Record<string, string>;
};

/**
 * The query args for a range, computed ONCE when it is picked. Building them
 * during render would put a fresh `new Date()` in the cache key every render,
 * and RTK Query would refetch in a loop.
 *
 * The window starts at UTC midnight because the backend buckets its series by
 * UTC day; a local midnight made "last 7 days" come back as 8 points.
 */
const rangeParams = (
    value: TDateRangeValue,
): Record<string, string> | undefined => {
    const days = DATE_RANGES.find((range) => range.value === value)?.days;
    if (!days) return undefined;

    const end = new Date();
    const start = new Date(
        Date.UTC(
            end.getUTCFullYear(),
            end.getUTCMonth(),
            end.getUTCDate() - (days - 1),
        ),
    );
    return { startDate: start.toISOString(), endDate: end.toISOString() };
};

const toRange = (value: TDateRangeValue): TDateRange => ({
    value,
    label: DATE_RANGES.find((range) => range.value === value)?.label ?? "",
    params: rangeParams(value),
});

/** Range state for an analytics screen. Pass `range.params` to the query. */
export function useDateRange(initial: TDateRangeValue = "all") {
    const [range, setRange] = useState<TDateRange>(() => toRange(initial));
    return {
        range,
        setRangeValue: (value: TDateRangeValue) => setRange(toRange(value)),
    };
}

export default function DateRangeSelect({
    value,
    onChange,
    isFetching,
}: {
    value: TDateRangeValue;
    onChange: (value: TDateRangeValue) => void;
    isFetching?: boolean;
}) {
    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger
                className="w-40 bg-white"
                aria-label="Date range"
                aria-busy={isFetching}
            >
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {DATE_RANGES.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
