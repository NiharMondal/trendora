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
    isLoading?: boolean;
    search?: {
        value: string;
        onChange: (value: string) => void;
        placeholder?: string;
    };
    pagination?: {
        total: number;
        page: number;
        limit: number;
        onPageChange: (page: number) => void;
        onLimitChange: (limit: number) => void;
    };
};
