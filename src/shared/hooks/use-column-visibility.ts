"use client";

import { useEffect, useMemo, useState } from "react";

import { DataTableColumn } from "@/shared/components/table/table-types";

export type TColumnOption = {
    key: string;
    label: string;
    visible: boolean;
    hideable: boolean;
};

const STORAGE_PREFIX = "trendora:table-columns:";

const defaultHiddenKeys = <T,>(columns: DataTableColumn<T>[]) =>
    columns
        .filter((col) => col.defaultHidden && col.hideable !== false)
        .map((col) => String(col.key));

const labelOf = <T,>(col: DataTableColumn<T>) =>
    col.label ??
    (typeof col.header === "string" ? col.header : String(col.key));

/**
 * Which columns of a `DataTable` are shown, remembered per browser.
 *
 * Storage is read in an effect, not during the first render: the table is
 * server-rendered with its defaults, and reading `localStorage` up front
 * would render different markup on the client and fail hydration. Every
 * storage access is guarded — private windows and blocked site data throw.
 *
 * Only the *hidden* keys are stored, so a column added to the table later
 * shows up for everyone instead of staying hidden behind an old preference.
 */
export function useColumnVisibility<T>(
    columns: DataTableColumn<T>[],
    storageKey?: string,
) {
    const [hidden, setHidden] = useState<string[]>(() =>
        defaultHiddenKeys(columns),
    );
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (!storageKey) return;
        try {
            const raw = window.localStorage.getItem(STORAGE_PREFIX + storageKey);
            if (raw) {
                const parsed: unknown = JSON.parse(raw);
                if (
                    Array.isArray(parsed) &&
                    parsed.every((key) => typeof key === "string")
                ) {
                    setHidden(parsed);
                }
            }
        } catch {
            // No storage — keep the defaults.
        }
        setLoaded(true);
    }, [storageKey]);

    useEffect(() => {
        if (!storageKey || !loaded) return;
        try {
            window.localStorage.setItem(
                STORAGE_PREFIX + storageKey,
                JSON.stringify(hidden),
            );
        } catch {
            // Not persisted this time; the choice still applies until reload.
        }
    }, [hidden, loaded, storageKey]);

    const hiddenSet = useMemo(() => new Set(hidden), [hidden]);
    const isVisible = (col: DataTableColumn<T>) =>
        col.hideable === false || !hiddenSet.has(String(col.key));

    const visibleColumns = columns.filter(isVisible);

    const options: TColumnOption[] = columns.map((col) => ({
        key: String(col.key),
        label: labelOf(col),
        visible: isVisible(col),
        hideable: col.hideable !== false,
    }));

    const toggleColumn = (key: string) =>
        setHidden((prev) =>
            prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
        );

    const resetColumns = () => setHidden(defaultHiddenKeys(columns));

    const isDefault =
        [...hiddenSet].sort().join() === defaultHiddenKeys(columns).sort().join();

    return { visibleColumns, options, toggleColumn, resetColumns, isDefault };
}
