"use client";

import { ArrowUpDown, Search, SlidersHorizontal, X } from "lucide-react";

import { TProductFiltersState } from "@/features/products/hooks/use-product-filters";
import { storefrontSortOptions } from "@/shared/constants/sort-options";
import { Input } from "@/shared/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/ui/select";

type ProductToolbarProps = {
    filters: TProductFiltersState;
    /** Matches for the current filters, from the server. */
    totalProducts?: number;
    isFetching: boolean;
    onOpenFilters: () => void;
};

/**
 * Search, sort and the result count — plus the button that opens the filter
 * panel on anything narrower than `lg`, where the sidebar is hidden.
 */
export default function ProductToolbar({
    filters,
    totalProducts,
    isFetching,
    onOpenFilters,
}: ProductToolbarProps) {
    return (
        <div className="space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="search"
                        value={filters.search}
                        onChange={(event) =>
                            filters.setSearch(event.target.value)
                        }
                        placeholder="Search products..."
                        aria-label="Search products"
                        className="h-10 pl-9 pr-9"
                    />
                    {filters.search && (
                        <button
                            type="button"
                            onClick={() => filters.setSearch("")}
                            aria-label="Clear search"
                            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-destructive"
                        >
                            <X className="size-4" />
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {/* The sidebar is hidden below lg, so this is the only way
                        into the filters on a phone or a tablet. */}
                    <button
                        type="button"
                        onClick={onOpenFilters}
                        className="flex h-10 cursor-pointer items-center gap-2 rounded-md border border-input px-3 text-sm lg:hidden"
                    >
                        <SlidersHorizontal className="size-4" />
                        Filters
                        {filters.activeFilterCount > 0 && (
                            <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[11px] text-primary-foreground">
                                {filters.activeFilterCount}
                            </span>
                        )}
                    </button>

                    <Select
                        value={filters.sortBy}
                        onValueChange={filters.setSortBy}
                    >
                        <SelectTrigger
                            className="h-10 min-w-[170px]"
                            aria-label="Sort products"
                        >
                            <ArrowUpDown className="size-4 text-muted-foreground" />
                            <SelectValue placeholder="Sort" />
                        </SelectTrigger>
                        <SelectContent>
                            {storefrontSortOptions.map((option) => (
                                <SelectItem
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <p className="text-sm text-muted-foreground" aria-live="polite">
                {isFetching && totalProducts === undefined
                    ? "Loading products..."
                    : `${totalProducts ?? 0} ${
                          totalProducts === 1 ? "product" : "products"
                      } found`}
            </p>
        </div>
    );
}
