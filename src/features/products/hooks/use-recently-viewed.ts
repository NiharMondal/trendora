"use client";

import { useCallback, useSyncExternalStore } from "react";

import { useAllProductsQuery } from "@/features/products/api/product.api";
import { TProduct } from "@/features/products/types/product.types";

const STORAGE_KEY = "trendora:recently-viewed";
/** Enough for a shelf; older views fall off the end. */
const MAX_ITEMS = 12;
/** Same-tab writes do not fire `storage`, so this tells our own subscribers. */
const CHANGE_EVENT = "trendora:recently-viewed-change";

const EMPTY: string[] = [];
let cachedRaw: string | null = null;
let cachedIds: string[] = EMPTY;

/**
 * Only product IDS are stored, newest first — never a snapshot of the product.
 * A stored price or name goes stale the moment the seller edits it, and a
 * delisted product would linger. The ids are re-fetched through the public
 * catalogue instead, which returns current data and silently drops anything no
 * longer on sale.
 *
 * Storage can be missing or throw (private windows, blocked site data), so
 * every access is guarded and the feature simply renders nothing then.
 */
const readIds = (): string[] => {
    let raw: string | null = null;
    try {
        raw = window.localStorage.getItem(STORAGE_KEY);
    } catch {
        return EMPTY;
    }
    // useSyncExternalStore needs a stable snapshot, so re-parse only on change.
    if (raw === cachedRaw) return cachedIds;
    cachedRaw = raw;
    try {
        const parsed: unknown = raw ? JSON.parse(raw) : [];
        cachedIds = Array.isArray(parsed)
            ? parsed.filter((id): id is string => typeof id === "string")
            : EMPTY;
    } catch {
        cachedIds = EMPTY;
    }
    return cachedIds;
};

const subscribe = (onChange: () => void) => {
    window.addEventListener("storage", onChange);
    window.addEventListener(CHANGE_EVENT, onChange);
    return () => {
        window.removeEventListener("storage", onChange);
        window.removeEventListener(CHANGE_EVENT, onChange);
    };
};

/** The viewer's recently viewed product ids, newest first, plus a recorder. */
export function useRecentlyViewed() {
    const ids = useSyncExternalStore(subscribe, readIds, () => EMPTY);

    const recordView = useCallback((productId: string) => {
        if (!productId) return;
        const next = [productId, ...readIds().filter((id) => id !== productId)].slice(
            0,
            MAX_ITEMS,
        );
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
            return;
        }
        window.dispatchEvent(new Event(CHANGE_EVENT));
    }, []);

    return { ids, recordView };
}

/**
 * The recently viewed products themselves, in viewing order.
 *
 * One request: `GET /products?id=a,b,c`. `id` is not a storefront filter key,
 * so it reaches the backend's generic column filter, which reads a
 * comma-separated value as `IN` — and the public list still applies its
 * visibility gate, so a draft or delisted product never comes back.
 */
export function useRecentlyViewedProducts(excludeId?: string) {
    const { ids } = useRecentlyViewed();
    const wanted = ids.filter((id) => id !== excludeId);

    const { data, isLoading } = useAllProductsQuery(
        { id: wanted.join(","), limit: String(MAX_ITEMS) },
        { skip: wanted.length === 0 },
    );

    // The server returns them in its own order; put them back in ours.
    const byId = new Map(
        (data?.result ?? []).map((product): [string, TProduct] => [product.id, product]),
    );
    const products = wanted
        .map((id) => byId.get(id))
        .filter((product): product is TProduct => Boolean(product));

    return { products, isLoading: wanted.length > 0 && isLoading };
}
