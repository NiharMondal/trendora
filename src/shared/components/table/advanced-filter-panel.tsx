"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { useId } from "react";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/ui/select";

import { ToolbarFilter } from "./table-types";

/** Sentinel for "no value" — Radix Select rejects an empty-string item value. */
const ALL_VALUE = "__all__";

type Props = {
    id: string;
    filters: ToolbarFilter[];
    columnFilters?: Record<string, string>;
    defaults?: Record<string, string>;
    setFilter: (key: string, value: string) => void;
    /** Batch setter — "Clear" moves every advanced param in one URL write. */
    setFilters: (updates: Record<string, string>) => void;
    activeCount: number;
    onClose: () => void;
};

/**
 * The expandable half of the toolbar: every `placement: "advanced"` filter
 * as a labelled field in a grid that goes from one column on a phone to four
 * on a wide screen.
 */
export default function AdvancedFilterPanel({
    id,
    filters,
    columnFilters,
    defaults,
    setFilter,
    setFilters,
    activeCount,
    onClose,
}: Props) {
    // One write, not one per filter: two `setFilter` calls in the same tick
    // build from the same URL snapshot and the second discards the first.
    const clearAll = () =>
        setFilters(
            Object.fromEntries(
                filters.map((filter) => [
                    filter.key,
                    defaults?.[filter.key] ?? "",
                ]),
            ),
        );

    return (
        <div
            id={id}
            className="space-y-4 rounded-lg border border-muted bg-gray-50/60 p-4"
        >
            <div className="flex items-center justify-between gap-3">
                <p className="flex items-center gap-2 text-sm font-semibold">
                    <SlidersHorizontal
                        className="size-4 text-primary-600"
                        aria-hidden="true"
                    />
                    Advanced filters
                    {activeCount > 0 && (
                        <span className="rounded-full bg-primary-100 px-2 py-0.5 text-[11px] font-semibold text-primary-700">
                            {activeCount} active
                        </span>
                    )}
                </p>
                <div className="flex items-center gap-1">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={clearAll}
                        disabled={activeCount === 0}
                        className="text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                        <X />
                        <span className="hidden sm:inline">Clear</span>
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        aria-controls={id}
                        aria-expanded
                        className="text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                        Hide
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filters.map((filter) => (
                    <FilterField
                        key={filter.key}
                        filter={filter}
                        value={columnFilters?.[filter.key] ?? ""}
                        fallback={defaults?.[filter.key] ?? ""}
                        onChange={(next) => setFilter(filter.key, next)}
                    />
                ))}
            </div>
        </div>
    );
}

function FilterField({
    filter,
    value,
    fallback,
    onChange,
}: {
    filter: ToolbarFilter;
    value: string;
    fallback: string;
    onChange: (value: string) => void;
}) {
    const labelId = useId();
    const Icon = filter.icon;
    // A select by default: it is the same size whether a filter has 2
    // options or 200, so the panel's layout never depends on the data.
    const display = filter.display ?? "select";
    const isActive = !!value && value !== fallback;

    return (
        <div
            role={display === "chips" ? "group" : undefined}
            aria-labelledby={labelId}
            className="space-y-1.5"
        >
            <p
                id={labelId}
                className={cn(
                    "flex items-center gap-1.5 text-xs font-medium",
                    isActive ? "text-primary-700" : "text-muted-foreground",
                )}
            >
                {Icon && <Icon className="size-3.5" />}
                {filter.label}
            </p>

            {display === "chips" ? (
                <div className="flex flex-wrap gap-1.5">
                    {filter.options.map((option) => {
                        const selected = value === option.value;
                        return (
                            <Button
                                key={option.value}
                                type="button"
                                variant="outline"
                                size="sm"
                                aria-pressed={selected}
                                // Clicking the selected chip again clears it,
                                // so no separate "All" chip is needed.
                                onClick={() =>
                                    onChange(selected ? fallback : option.value)
                                }
                                className={cn(
                                    "h-8 rounded-full bg-white px-3 text-xs font-medium shadow-none hover:bg-gray-50 hover:text-foreground",
                                    selected &&
                                        "border-primary-300 bg-primary-50 text-primary-700 hover:bg-primary-100 hover:text-primary-700",
                                )}
                            >
                                {option.label}
                            </Button>
                        );
                    })}
                </div>
            ) : (
                <Select
                    value={value === "" ? ALL_VALUE : value}
                    onValueChange={(next) =>
                        onChange(next === ALL_VALUE ? "" : next)
                    }
                >
                    <SelectTrigger
                        size="sm"
                        aria-labelledby={labelId}
                        className={cn(
                            "w-full rounded-lg bg-white",
                            isActive &&
                                "border-primary-300 bg-primary-50/50 text-primary-700",
                        )}
                    >
                        <SelectValue placeholder={filter.allLabel ?? "All"} />
                    </SelectTrigger>
                    <SelectContent>
                        {!filter.hideAllOption && (
                            <SelectItem value={ALL_VALUE}>
                                {filter.allLabel ?? "All"}
                            </SelectItem>
                        )}
                        {filter.options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}
        </div>
    );
}
