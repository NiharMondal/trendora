import { ComponentType, ReactNode } from "react";

import { TMetaData } from "@/shared/types/common.types";

export type ColumnAlign = "left" | "center" | "right";

export type DataTableColumn<T> = {
    key: keyof T | string;
    header: ReactNode;
    cell?: (row: T) => ReactNode;
    className?: string;
    /** Applied to the `<th>` only — use for widths/alignment of the header cell. */
    headerClassName?: string;
    /** Aligns both the header and the body cell. Defaults to `left`. */
    align?: ColumnAlign;
    /** Tailwind width utility for the column, e.g. `"w-40"`. */
    width?: string;
    /**
     * Name in the "Columns" menu. Defaults to `header` when that is a string;
     * set it when the header is an icon or other node.
     */
    label?: string;
    /**
     * Whether the "Columns" menu may hide this column. Defaults to `true`;
     * set `false` for the column that identifies the row and for actions.
     */
    hideable?: boolean;
    /** Start hidden until the viewer turns it on in the "Columns" menu. */
    defaultHidden?: boolean;
};

/**
 * Turns on the toolbar's "Columns" menu. The viewer's choice is remembered
 * in this browser under `storageKey` — a per-viewer convenience, so it is
 * fine for it to be lost; the table renders its defaults without it.
 */
export type ColumnConfig = {
    /** Unique per table, e.g. `"admin-products"`. */
    storageKey: string;
};

export type ExpandableConfig<T, S> = {
    getSubRows: (row: T) => S[] | undefined | null;
    subColumns: DataTableColumn<S>[];
    subRowKey: (sub: S, parent: T) => string;
    title?: (row: T) => ReactNode;
    emptyMessage?: string;
    defaultExpanded?: boolean | ((row: T) => boolean);
};

export type SortByOption = {
    label: string;
    value: string;
};

/**
 * A extra column filter rendered in the toolbar as a labelled select.
 *
 * `key` is the query-param name, so it must also be declared as a
 * `defaultFilters` key on `useTableFilters` — that is what keeps the value in
 * the URL, feeds it to `queryParams` and clears it on reset.
 */
export type ToolbarFilter = {
    key: string;
    label: string;
    options: SortByOption[];
    /** Label of the option that clears the filter. Defaults to `All`. */
    allLabel?: string;
    /** Omit the clear option entirely (for a filter that must always have a value). */
    hideAllOption?: boolean;
    icon?: ComponentType<{ className?: string }>;
    className?: string;
    /**
     * `primary` (default) renders inline beside search. `advanced` goes in
     * the collapsible "Filters" panel — use it once a table has more filters
     * than fit on one row, keeping the one or two most-used ones primary.
     */
    placement?: "primary" | "advanced";
    /**
     * How an advanced filter is drawn. `select` (default) takes the same space
     * however many options there are. `chips` is opt-in, and only sensible for
     * a short FIXED list (two or three values) — never for data-driven options
     * like brands or stores, which would wrap into a wall of buttons.
     */
    display?: "select" | "chips";
};

export type EmptyStateConfig = {
    title?: string;
    description?: string;
    icon?: ComponentType<{ className?: string; strokeWidth?: number }>;
    actionLabel?: string;
    onAction?: () => void;
};

/** Shape returned by `useTableFilters` — drives the toolbar and pagination. */
export type TableFilters = {
    currentPage: number;
    limit: string;
    search: string;
    sortBy: string;
    setCurrentPage: (page: number) => void;
    setSearch: (value: string) => void;
    setSortBy: (value: string) => void;
    handleLimitChange: (value: string) => void;
    handleResetFilters: () => void;
    /** Current value of every extra column filter, keyed by query-param name. */
    columnFilters?: Record<string, string>;
    setFilter?: (key: string, value: string) => void;
    /** Several filters in ONE URL write — see `useTableFilters.setFilters`. */
    setFilters?: (updates: Record<string, string>) => void;
    /** The values a filter is compared against to decide whether it is "active". */
    defaults?: Record<string, string>;
    activeFilterCount?: number;
    isFiltered?: boolean;
};

export type DataTableProps<T, S = unknown> = {
    data: T[];
    columns: DataTableColumn<T>[];
    rowKey: (row: T) => string;
    rowClassName?: (row: T) => string;
    onRowClick?: (row: T) => void;
    isFetching?: boolean;
    /**
     * The query hook's `error`. When set the table renders an error state with
     * the backend's message instead of rows — even if stale `data` from a
     * previous page is still cached — so a failure never reads as "no data".
     */
    error?: unknown;
    /** Retry for the error state; pass the hook's `refetch`. */
    onRetry?: () => void;
    expandable?: ExpandableConfig<T, S>;
    /** Pass the object returned by `useTableFilters` to render the toolbar. */
    filters?: TableFilters;
    /** `meta` from the server response envelope — renders pagination when totalPages > 1. */
    meta?: TMetaData;
    sortByOptions?: SortByOption[];
    /** Page-size choices in the toolbar. Defaults to 10/20/30/50/100. */
    limitOptions?: string[];
    /** Extra column filters rendered beside search — see `ToolbarFilter`. */
    toolbarFilters?: ToolbarFilter[];
    /** Placeholder for the toolbar search input. */
    placeholder?: string;
    /** Toolbar heading. Renders the toolbar header strip when set. */
    title?: ReactNode;
    description?: ReactNode;
    icon?: ComponentType<{ className?: string }>;
    /** Right-hand side of the toolbar header — e.g. an "Add item" button. */
    actions?: ReactNode;
    /** Copy shown by `NoDataFound` when there are no rows. */
    emptyState?: EmptyStateConfig;
    /** Skeleton rows rendered while fetching. Defaults to 5. */
    loadingRows?: number;
    /** Adds a "Columns" menu to show and hide columns — see `ColumnConfig`. */
    columnConfig?: ColumnConfig;
    className?: string;
};
