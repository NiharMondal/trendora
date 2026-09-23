"use client";

import { X } from "lucide-react";

import {
    MULTI_VALUE_KEYS,
    TProductFiltersState,
} from "@/features/products/hooks/use-product-filters";
import { TProductFacets } from "@/features/products/types/product-filter.types";
import { currencyFormatter } from "@/features/cart/utils/calculate-order-total";

type ActiveFiltersProps = {
    facets?: TProductFacets;
    filters: TProductFiltersState;
};

type TChip = { key: string; label: string; onRemove: () => void };

const GENDER_LABELS: Record<string, string> = {
    MEN: "Men",
    WOMEN: "Women",
    KIDS: "Kids",
    UNISEX: "Unisex",
};

/**
 * What is currently applied, as removable chips.
 *
 * Labels are looked up in the facet response rather than stored in the URL:
 * the URL carries ids so it stays a valid backend query, and the facets always
 * contain the selected option because the counts are disjunctive — the
 * dimension being counted keeps every one of its values.
 */
export default function ActiveFilters({ facets, filters }: ActiveFiltersProps) {
    const { columnFilters, selected, removeValue, setFilter, setPriceRange } =
        filters;

    const labelFor = (
        key: (typeof MULTI_VALUE_KEYS)[number],
        value: string,
    ): string => {
        switch (key) {
            case "categoryId":
                return (
                    facets?.categories.find((entry) => entry.id === value)
                        ?.name ?? value
                );
            case "brandId":
                return (
                    facets?.brands.find((entry) => entry.id === value)?.name ??
                    value
                );
            case "vendorId":
                return (
                    facets?.stores.find((entry) => entry.id === value)
                        ?.storeName ?? value
                );
            case "sizeId":
                return (
                    facets?.sizes.find((entry) => entry.id === value)?.name ??
                    value
                );
            case "gender":
                return GENDER_LABELS[value] ?? value;
        }
    };

    const chips: TChip[] = [];

    for (const key of MULTI_VALUE_KEYS) {
        for (const value of selected[key]) {
            chips.push({
                key: `${key}:${value}`,
                label: labelFor(key, value),
                onRemove: () => removeValue(key, value),
            });
        }
    }

    const { minPrice, maxPrice, minRating, inStock, onSale } = columnFilters;

    if (minPrice || maxPrice) {
        chips.push({
            key: "price",
            label: `${minPrice ? currencyFormatter(Number(minPrice)) : "Any"} – ${
                maxPrice ? currencyFormatter(Number(maxPrice)) : "Any"
            }`,
            onRemove: () => setPriceRange("", ""),
        });
    }

    if (minRating) {
        chips.push({
            key: "rating",
            label: `${minRating}★ & up`,
            onRemove: () => setFilter("minRating", ""),
        });
    }

    if (inStock === "true") {
        chips.push({
            key: "inStock",
            label: "In stock",
            onRemove: () => setFilter("inStock", ""),
        });
    }

    if (onSale === "true") {
        chips.push({
            key: "onSale",
            label: "On sale",
            onRemove: () => setFilter("onSale", ""),
        });
    }

    if (filters.search) {
        chips.push({
            key: "search",
            label: `"${filters.search}"`,
            onRemove: () => filters.setSearch(""),
        });
    }

    if (chips.length === 0) return null;

    return (
        <div className="flex flex-wrap items-center gap-2">
            {chips.map((chip) => (
                <button
                    key={chip.key}
                    type="button"
                    onClick={chip.onRemove}
                    aria-label={`Remove filter ${chip.label}`}
                    className="group inline-flex cursor-pointer items-center gap-1 rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs text-foreground hover:border-destructive-300"
                >
                    {chip.label}
                    <X className="size-3 text-muted-foreground group-hover:text-destructive" />
                </button>
            ))}

            <button
                type="button"
                onClick={filters.handleResetFilters}
                className="cursor-pointer text-xs text-muted-foreground underline underline-offset-2 hover:text-destructive"
            >
                Clear all
            </button>
        </div>
    );
}
