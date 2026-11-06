import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

/**
 * One URL search param that a screen opens and closes on its own — the
 * `?id=…` that drives a table's edit sheet.
 *
 * `set` and `clear` touch only `key` and keep every other param, so the
 * table's `page` / `limit` / `search` / `sortBy` / filters survive opening and
 * closing the sheet. Pushing a bare `?id=…` (or `?`) instead is what used to
 * throw the viewer back to the default page size.
 */
export function useUrlParam(key: string) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const write = useCallback(
        (value: string | null) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value) params.set(key, value);
            else params.delete(key);

            const query = params.toString();
            router.push(query ? `${pathname}?${query}` : pathname, {
                scroll: false,
            });
        },
        [key, router, pathname, searchParams],
    );

    return {
        value: searchParams.get(key),
        set: useCallback((value: string) => write(value), [write]),
        clear: useCallback(() => write(null), [write]),
    };
}
