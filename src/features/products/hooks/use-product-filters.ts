"use client";

import { useCallback, useMemo } from "react";

import { useTableFilters } from "@/shared/hooks/use-table-filters";

/**
 * Query params the storefront listing understands, mirroring
 * `STOREFRONT_FILTER_KEYS` in the backend's `helpers/product-filter.ts`.
 * The two lists must agree: the backend turns an unrecognised key into a
 * `where` clause on a column of that name, so a typo here fails as an empty
 * page rather than as an error.
 */
export const PRODUCT_FILTER_KEYS = [
    "categoryId",
    "brandId",
    "vendorId",
    "gender",
    "sizeId",
    "minPrice",
    "maxPrice",
    "minRating",
    "inStock",
] as const;

export type TProductFilterKey = (typeof PRODUCT_FILTER_KEYS)[number];

/** The keys a shopper ticks several values of. Stored comma-joined. */
export const MULTI_VALUE_KEYS = [
    "categoryId",
    "brandId",
    "vendorId",
    "gender",
    "sizeId",
] as const satisfies readonly TProductFilterKey[];

const EMPTY_FILTERS = Object.fromEntries(
    PRODUCT_FILTER_KEYS.map((key) => [key, ""]),
) as Record<TProductFilterKey, string>;

const parseList = (value: string | undefined): string[] =>
    (value ?? "").split(",").filter(Boolean);

/**
 * `useTableFilters` with the storefront's filter set declared on it.
 *
 * Everything lives in the URL, so a filtered catalogue is a shareable link and
 * the back button steps through the shopper's choices. On top of the hook it
 * adds the one thing a facet panel needs and a table toolbar does not:
 * multi-select, which is stored as one comma-joined param per dimension
 * (`?brandId=nike,adidas`) because that is the form the backend reads as an
 * `IN`.
 */
export function useProductFilters() {
    const filters = useTableFilters({
        defaultSortBy: "createdAt:desc",
        // A grid, not a table — 12 divides evenly by the 2/3/4-column
        // breakpoints so the last row is never a lone orphan.
        defaultLimit: "12",
        defaultFilters: EMPTY_FILTERS,
    });

    const { columnFilters, setFilter, setFilters } = filters;

    const selected = useMemo(() => {
        const map = {} as Record<(typeof MULTI_VALUE_KEYS)[number], string[]>;
        for (const key of MULTI_VALUE_KEYS) {
            map[key] = parseList(columnFilters[key]);
        }
        return map;
    }, [columnFilters]);

    const isSelected = useCallback(
        (key: (typeof MULTI_VALUE_KEYS)[number], value: string) =>
            parseList(columnFilters[key]).includes(value),
        [columnFilters],
    );

    const toggleValue = useCallback(
        (key: (typeof MULTI_VALUE_KEYS)[number], value: string) => {
            const current = parseList(columnFilters[key]);
            const next = current.includes(value)
                ? current.filter((entry) => entry !== value)
                : [...current, value];

            setFilter(key, next.join(","));
        },
        [columnFilters, setFilter],
    );

    /** Drop one value from a multi-select — what a removable chip does. */
    const removeValue = useCallback(
        (key: (typeof MULTI_VALUE_KEYS)[number], value: string) => {
            const next = parseList(columnFilters[key]).filter(
                (entry) => entry !== value,
            );
            setFilter(key, next.join(","));
        },
        [columnFilters, setFilter],
    );

    /**
     * Min and max move together in ONE URL write — two `setFilter` calls in a
     * row would each start from the same params snapshot and the second would
     * drop the first.
     */
    const setPriceRange = useCallback(
        (min: string, max: string) => {
            setFilters({ minPrice: min, maxPrice: max });
        },
        [setFilters],
    );

    return {
        ...filters,
        columnFilters: columnFilters as Record<TProductFilterKey, string>,
        selected,
        isSelected,
        toggleValue,
        removeValue,
        setPriceRange,
    };
}

export type TProductFiltersState = ReturnType<typeof useProductFilters>;
