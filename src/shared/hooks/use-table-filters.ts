import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { useDebounce } from "use-debounce";

interface UseTableFiltersOptions {
    defaultSortBy?: string;
    defaultLimit?: string;
    debounceMs?: number;
    /**
     * Extra column filters, e.g. `{ status: "PENDING", vendorId: "" }`.
     *
     * The key is the query-param name the backend receives, the value is its
     * default. Declaring it here is what keeps the filter in the URL, adds it
     * to `queryParams`, and clears it on reset — an empty value is omitted from
     * the request entirely, because the backend turns any unknown key into a
     * `where` clause and `status: ""` matches nothing.
     */
    defaultFilters?: Record<string, string>;
}

export function useTableFilters({
    defaultSortBy = "createdAt:desc",
    defaultLimit = "20",
    debounceMs = 1000,
    defaultFilters,
}: UseTableFiltersOptions = {}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Call sites pass `defaultFilters` as an inline literal, so compare by value
    // — a new object identity every render would churn every memo below.
    const filterSignature = JSON.stringify(defaultFilters ?? {});
    const filterDefaults: Record<string, string> = useMemo(
        () => JSON.parse(filterSignature),
        [filterSignature],
    );

    // Read from URL, fall back to defaults
    const page = searchParams.get("page") ?? "1";
    const limit = searchParams.get("limit") ?? defaultLimit;
    const search = searchParams.get("search") ?? "";
    const sortBy = searchParams.get("sortBy") ?? defaultSortBy;

    const [debouncedSearch] = useDebounce(search, debounceMs);

    const defaults: Record<string, string> = useMemo(
        () => ({
            page: "1",
            limit: defaultLimit,
            search: "",
            sortBy: defaultSortBy,
            ...filterDefaults,
        }),
        [defaultLimit, defaultSortBy, filterDefaults],
    );

    const columnFilters = useMemo(() => {
        const current: Record<string, string> = {};
        for (const key of Object.keys(filterDefaults)) {
            current[key] = searchParams.get(key) ?? filterDefaults[key];
        }
        return current;
    }, [filterDefaults, searchParams]);

    const updateParams = useCallback(
        (updates: Record<string, string>, reset = false) => {
            // On reset, start from empty params instead of current URL params
            const params = reset
                ? new URLSearchParams()
                : new URLSearchParams(searchParams.toString());

            Object.entries(updates).forEach(([key, value]) => {
                if (
                    value === defaults[key] ||
                    value === "" ||
                    value === undefined
                ) {
                    params.delete(key);
                } else {
                    params.set(key, value);
                }
            });

            const query = params.toString();
            router.replace(query ? `${pathname}?${query}` : pathname);
        },
        [router, pathname, searchParams, defaults],
    );

    const queryParams = useMemo(() => {
        const params: Record<string, string> = {
            page,
            limit,
            search: debouncedSearch,
            sortBy,
        };
        for (const [key, value] of Object.entries(columnFilters)) {
            if (value) params[key] = value;
        }
        return params;
    }, [page, limit, debouncedSearch, sortBy, columnFilters]);

    // Drives the toolbar's reset button and its "n active" badge. `page` is
    // deliberately excluded — paging is not a filter.
    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (search.trim() !== "") count += 1;
        if (limit !== defaultLimit) count += 1;
        if (sortBy !== defaultSortBy) count += 1;
        for (const [key, value] of Object.entries(columnFilters)) {
            if (value !== filterDefaults[key]) count += 1;
        }
        return count;
    }, [
        search,
        limit,
        sortBy,
        defaultLimit,
        defaultSortBy,
        columnFilters,
        filterDefaults,
    ]);

    return {
        currentPage: Number(page),
        limit,
        search,
        sortBy,
        columnFilters,
        defaults,
        queryParams,
        activeFilterCount,
        isFiltered: activeFilterCount > 0,
        setCurrentPage: (p: number) => updateParams({ page: p.toString() }),
        setSearch: (s: string) => updateParams({ search: s, page: "1" }),
        setSortBy: (s: string) => updateParams({ sortBy: s, page: "1" }),
        setFilter: (key: string, value: string) =>
            updateParams({ [key]: value, page: "1" }),
        handleLimitChange: (l: string) => updateParams({ limit: l, page: "1" }),
        handleResetFilters: () =>
            updateParams(
                {
                    page: "1",
                    limit: defaultLimit,
                    search: "",
                    sortBy: defaultSortBy,
                    ...filterDefaults,
                },
                true,
            ),
    };
}
