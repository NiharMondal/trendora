import { ReactNode } from "react";

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

export type DataTableProps<T, S = unknown> = {
    data: T[];
    columns: DataTableColumn<T>[];
    rowKey: (row: T) => string;
    rowClassName?: (row: T) => string;
    isFetching?: boolean;
    expandable?: ExpandableConfig<T, S>;
};
