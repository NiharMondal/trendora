import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { useDebounce } from "use-debounce";

interface UseTableFiltersOptions {
    defaultSortBy?: string;
    defaultLimit?: string;
    debounceMs?: number;
}

export function useTableFilters({
    defaultSortBy = "createdAt:desc",
    defaultLimit = "10",
    debounceMs = 1000,
}: UseTableFiltersOptions = {}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Read from URL, fall back to defaults
    const page = searchParams.get("page") ?? "1";
    const limit = searchParams.get("limit") ?? defaultLimit;
    const search = searchParams.get("search") ?? "";
    const sortBy = searchParams.get("sortBy") ?? defaultSortBy;

    const [debouncedSearch] = useDebounce(search, debounceMs);

    const updateParams = useCallback(
        (updates: Record<string, string>, reset = false) => {
            const defaults: Record<string, string> = {
                page: "1",
                limit: defaultLimit,
                search: "",
                sortBy: defaultSortBy,
            };

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
        [router, pathname, searchParams, defaultLimit, defaultSortBy],
    );

    const queryParams = {
        page,
        limit,
        search: debouncedSearch,
        sortBy,
    };

    return {
        currentPage: Number(page),
        limit,
        search,
        sortBy,
        queryParams,
        setCurrentPage: (p: number) => updateParams({ page: p.toString() }),
        setSearch: (s: string) => updateParams({ search: s, page: "1" }),
        setSortBy: (s: string) => updateParams({ sortBy: s, page: "1" }),
        handleLimitChange: (l: string) => updateParams({ limit: l, page: "1" }),
        handleResetFilters: () =>
            updateParams(
                {
                    page: "1",
                    limit: defaultLimit,
                    search: "",
                    sortBy: defaultSortBy,
                },
                true,
            ),
    };
}
