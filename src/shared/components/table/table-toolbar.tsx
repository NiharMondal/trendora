"use client";

import { ArrowUpDown, ListFilter, RotateCcw, Rows3, Search, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { ComponentType, ReactNode } from "react";

import { cn } from "@/shared/lib/utils";
import { Input } from "@/shared/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/ui/select";

import { SortByOption, ToolbarFilter } from "./table-types";

const DEFAULT_SORT_OPTIONS: SortByOption[] = [
    { label: "Newest first", value: "createdAt:desc" },
    { label: "Oldest first", value: "createdAt:asc" },
];

const DEFAULT_LIMIT_OPTIONS = ["10", "20", "30", "50", "100"];

/** Sentinel for "no value" — Radix Select rejects an empty-string item value. */
const ALL_VALUE = "__all__";

type TableToolbarProps = {
    search?: string;
    placeholder?: string;
    limit?: string;
    sortBy?: string;
    setLimit?: (value: string) => void;
    setSortBy?: (value: string) => void;
    setSearch?: (value: string) => void;
    sortByOptions?: SortByOption[];
    limitOptions?: string[];
    /** Extra column filters — values, setter and config. */
    columnFilters?: Record<string, string>;
    setFilter?: (key: string, value: string) => void;
    toolbarFilters?: ToolbarFilter[];
    /** Values each control is compared against to decide if it is "active". */
    defaults?: Record<string, string>;
    activeFilterCount?: number;
    onReset?: () => void;
    title?: ReactNode;
    description?: ReactNode;
    icon?: ComponentType<{ className?: string }>;
    actions?: ReactNode;
    className?: string;
};

/**
 * One control shell for every dropdown in the toolbar, so any number of filters
 * line up as a single row of identical controls.
 *
 * The pill *is* the `SelectTrigger` — the icon and the label are its children,
 * not siblings in a wrapper. Anything else leaves the label and icon as dead
 * space that does not open the dropdown.
 */
function FilterPill({
    label,
    icon: Icon,
    value,
    active,
    onChange,
    options,
    placeholder,
    className,
}: {
    label: string;
    icon: ComponentType<{ className?: string }>;
    value?: string;
    active?: boolean;
    onChange: (value: string) => void;
    options: SortByOption[];
    placeholder?: string;
    className?: string;
}) {
    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger
                size="sm"
                aria-label={label}
                className={cn(
                    "gap-1.5 rounded-lg border-input bg-white px-2.5 text-sm font-medium shadow-xs transition-colors",
                    active &&
                        "border-primary-300 bg-primary-50/50 text-primary-700",
                    className,
                )}
            >
                <Icon
                    className={cn(
                        "size-3.5 shrink-0",
                        active ? "text-primary-600" : "text-muted-foreground",
                    )}
                />
                <span className="hidden text-xs font-medium text-muted-foreground sm:inline">
                    {label}
                </span>
                <SelectValue placeholder={placeholder ?? label} />
            </SelectTrigger>
            <SelectContent>
                {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

type ActiveChip = { key: string; label: string; value: string; onClear: () => void };

export default function TableToolbar({
    search,
    setSearch,
    placeholder = "Search here...",
    limit,
    setLimit,
    sortBy,
    onReset,
    setSortBy,
    sortByOptions = DEFAULT_SORT_OPTIONS,
    limitOptions = DEFAULT_LIMIT_OPTIONS,
    columnFilters,
    setFilter,
    toolbarFilters,
    defaults,
    activeFilterCount,
    title,
    description,
    icon: Icon = ListFilter,
    actions,
    className,
}: TableToolbarProps) {
    const defaultLimit = defaults?.limit ?? "20";
    const defaultSortBy = defaults?.sortBy ?? "createdAt:desc";

    const searchActive = !!search && search.trim() !== "";
    const limitActive = !!limit && limit !== defaultLimit;
    const sortActive = !!sortBy && sortBy !== defaultSortBy;

    const labelFor = (options: SortByOption[], value?: string) =>
        options.find((option) => option.value === value)?.label ?? value ?? "";

    // Every applied filter becomes a removable chip, so what the list is
    // currently narrowed by is readable without opening a single dropdown.
    const chips: ActiveChip[] = [];

    if (searchActive && setSearch) {
        chips.push({
            key: "search",
            label: "Search",
            value: `"${search}"`,
            onClear: () => setSearch(""),
        });
    }

    toolbarFilters?.forEach((filter) => {
        const value = columnFilters?.[filter.key] ?? "";
        const fallback = defaults?.[filter.key] ?? "";
        if (!value || value === fallback || !setFilter) return;
        chips.push({
            key: filter.key,
            label: filter.label,
            value: labelFor(filter.options, value),
            onClear: () => setFilter(filter.key, fallback),
        });
    });

    if (sortActive && setSortBy) {
        chips.push({
            key: "sortBy",
            label: "Sorted by",
            value: labelFor(sortByOptions, sortBy),
            onClear: () => setSortBy(defaultSortBy),
        });
    }

    if (limitActive && setLimit) {
        chips.push({
            key: "limit",
            label: "Per page",
            value: `${limit}`,
            onClear: () => setLimit(defaultLimit),
        });
    }

    const count = activeFilterCount ?? chips.length;
    const isFiltered = count > 0;

    const handleResetFilters = () => {
        // `onReset` resets every filter in a single update, so avoid also
        // firing the individual setters (which would queue extra updates).
        if (onReset) {
            onReset();
            return;
        }
        if (setSearch) setSearch("");
        if (setLimit) setLimit(defaultLimit);
        if (setSortBy) setSortBy(defaultSortBy);
        toolbarFilters?.forEach((filter) =>
            setFilter?.(filter.key, defaults?.[filter.key] ?? ""),
        );
    };

    const hasHeader = !!title || !!description || !!actions;

    return (
        <div
            className={cn(
                "w-full overflow-hidden border-b border-muted",
                className,
            )}
        >
            {hasHeader && (
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-muted/70 bg-gradient-to-r from-primary-50/80 to-white py-3 rounded-md">
                    <div className="flex min-w-0 items-center gap-3">
                        <span className="h-9 w-1 shrink-0 rounded-full bg-gradient-to-b from-primary-300 to-primary-600" />
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600 ring-1 ring-primary-100">
                            <Icon className="size-4.5" />
                        </span>
                        <div className="min-w-0">
                            {title && (
                                <h3 className="truncate text-base leading-tight font-semibold tracking-tight text-foreground">
                                    {title}
                                </h3>
                            )}
                            {description && (
                                <p className="truncate text-xs text-muted-foreground">
                                    {description}
                                </p>
                            )}
                        </div>
                    </div>
                    {actions && (
                        <div className="flex items-center gap-2">{actions}</div>
                    )}
                </div>
            )}

            <div className="flex flex-wrap items-center gap-2.5 py-3">
                {setSearch && (
                    <div className="relative min-w-[200px] flex-1 md:max-w-sm">
                        <Search
                            className={cn(
                                "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 transition-colors",
                                searchActive
                                    ? "text-primary-600"
                                    : "text-muted-foreground",
                            )}
                        />
                        <Input
                            inputSize="sm"
                            aria-label={placeholder}
                            placeholder={placeholder}
                            className={cn(
                                "rounded-lg border-input bg-gray-50/70 pr-9 pl-9 transition-colors",
                                searchActive &&
                                    "border-primary-300 bg-white text-foreground",
                            )}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        {searchActive && (
                            <button
                                type="button"
                                onClick={() => setSearch("")}
                                aria-label="Clear search"
                                className="absolute top-1/2 right-2 flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            >
                                <X className="size-3.5" />
                            </button>
                        )}
                    </div>
                )}

                <div className="flex flex-1 flex-wrap items-center justify-end gap-2.5">
                    {setFilter &&
                        toolbarFilters?.map((filter) => {
                            const fallback = defaults?.[filter.key] ?? "";
                            const value = columnFilters?.[filter.key] ?? fallback;
                            const options = filter.hideAllOption
                                ? filter.options
                                : [
                                      {
                                          label: filter.allLabel ?? "All",
                                          value: ALL_VALUE,
                                      },
                                      ...filter.options,
                                  ];
                            return (
                                <FilterPill
                                    key={filter.key}
                                    label={filter.label}
                                    icon={filter.icon ?? ListFilter}
                                    value={value === "" ? ALL_VALUE : value}
                                    active={!!value && value !== fallback}
                                    onChange={(next) =>
                                        setFilter(
                                            filter.key,
                                            next === ALL_VALUE ? "" : next,
                                        )
                                    }
                                    options={options}
                                    placeholder={filter.allLabel ?? "All"}
                                    className={filter.className}
                                />
                            );
                        })}

                    {setSortBy && (
                        <FilterPill
                            label="Sort"
                            icon={ArrowUpDown}
                            value={sortBy}
                            active={sortActive}
                            onChange={setSortBy}
                            options={sortByOptions}
                        />
                    )}

                    {setLimit && (
                        <FilterPill
                            label="Show"
                            icon={Rows3}
                            value={limit?.toString()}
                            active={limitActive}
                            onChange={setLimit}
                            options={limitOptions.map((option) => ({
                                label: option,
                                value: option,
                            }))}
                            // keep 10 and 100 the same width so the row does not jump
                            className="[&_[data-slot=select-value]]:min-w-6"
                        />
                    )}

                    <AnimatePresence initial={false}>
                        {isFiltered && (
                            <motion.button
                                type="button"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.15 }}
                                onClick={handleResetFilters}
                                className="flex h-10 items-center gap-1.5 rounded-lg border border-destructive-100 bg-destructive-50/60 px-3 text-sm font-medium text-destructive-600 transition-colors hover:bg-destructive-100/70"
                            >
                                <RotateCcw className="size-3.5" />
                                <span className="hidden sm:inline">Reset</span>
                                <span className="flex size-5 items-center justify-center rounded-full bg-destructive-500 text-[10px] font-semibold text-white">
                                    {count}
                                </span>
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <AnimatePresence initial={false}>
                {chips.length > 0 && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        className="overflow-hidden"
                    >
                        <div className="flex flex-wrap items-center gap-2 border-t border-dashed border-muted bg-gray-50/60 px-4 py-2.5">
                            <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                                Filters
                            </span>
                            {chips.map((chip) => (
                                <span
                                    key={chip.key}
                                    className="inline-flex items-center gap-1.5 rounded-full border border-primary-100 bg-primary-50/70 py-1 pr-1 pl-2.5 text-xs font-medium text-primary-700"
                                >
                                    <span className="text-primary-600/70">
                                        {chip.label}:
                                    </span>
                                    <span className="max-w-[160px] truncate">
                                        {chip.value}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={chip.onClear}
                                        aria-label={`Clear ${chip.label} filter`}
                                        className="flex size-4 items-center justify-center rounded-full text-primary-600 transition-colors hover:bg-primary-200/70 hover:text-primary-800"
                                    >
                                        <X className="size-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
