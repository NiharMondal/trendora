import { ReactNode } from "react";

export type DataTableColumn<T> = {
    key: keyof T | string;
    header: string;
    cell?: (row: T) => ReactNode;
    className?: string;
};

export type DataTableProps<T> = {
    data: T[];
    columns: DataTableColumn<T>[];
    rowKey: (row: T) => string;
    rowClassName?: (row: T) => string;
    isFetching?: boolean;
};
