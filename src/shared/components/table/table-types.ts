import { ReactNode } from "react";

import { TMetaData } from "@/shared/types/common.types";

export type DataTableColumn<T> = {
    key: keyof T | string;
    header: ReactNode;
    cell?: (row: T) => ReactNode;
    className?: string;
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
};

export type DataTableProps<T, S = unknown> = {
    data: T[];
    columns: DataTableColumn<T>[];
    rowKey: (row: T) => string;
    rowClassName?: (row: T) => string;
    isFetching?: boolean;
    expandable?: ExpandableConfig<T, S>;
    /** Pass the object returned by `useTableFilters` to render the toolbar. */
    filters?: TableFilters;
    /** `meta` from the server response envelope — renders pagination when totalPages > 1. */
    meta?: TMetaData;
    sortByOptions?: SortByOption[];
    /** Placeholder for the toolbar search input. */
    placeholder?: string;
    className?: string;
};
