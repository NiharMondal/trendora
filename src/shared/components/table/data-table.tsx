"use client";

import NoDataFound from "@/shared/components/no-data-found";
import QueryError from "@/shared/components/query-error";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/ui/table";
import { cn } from "@/shared/lib/utils";
import { ChevronRight } from "lucide-react";
import { Fragment, ReactNode, useState } from "react";

import DataTableSubRows from "./data-table-sub-rows";
import Pagination from "./pagination";
import TableLoading from "./table-loading";
import TableToolbar from "./table-toolbar";
import { ColumnAlign, DataTableColumn, DataTableProps } from "./table-types";

const ALIGN_CLASS: Record<ColumnAlign, string> = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
};

const columnClasses = <T,>(col: DataTableColumn<T>) =>
    cn(col.align && ALIGN_CLASS[col.align], col.width, col.className);

export default function DataTable<T, S = unknown>({
    data,
    columns,
    rowKey,
    rowClassName,
    onRowClick,
    isFetching,
    error,
    onRetry,
    expandable,
    filters,
    meta,
    sortByOptions,
    limitOptions,
    toolbarFilters,
    placeholder,
    title,
    description,
    icon,
    actions,
    emptyState,
    loadingRows,
    className,
}: DataTableProps<T, S>) {
    const initialExpanded = () => {
        if (!expandable?.defaultExpanded || !data) return new Set<string>();
        const seed = new Set<string>();
        for (const row of data) {
            const open =
                typeof expandable.defaultExpanded === "function"
                    ? expandable.defaultExpanded(row)
                    : expandable.defaultExpanded;
            if (open) seed.add(rowKey(row));
        }
        return seed;
    };

    const [expanded, setExpanded] = useState<Set<string>>(initialExpanded);

    const toggle = (key: string) => {
        setExpanded((prev) => {
            const next = new Set(prev);
            if (next.has(key)) next.delete(key);
            else next.add(key);
            return next;
        });
    };

    const totalCols = columns.length + (expandable ? 1 : 0);
    const showPagination =
        !error && !!filters && !!meta && meta.totalPages > 1;
    // The header strip stands on its own, so a table with a title but no
    // `filters` still gets a toolbar (just without the controls row).
    const showToolbar = !!filters || !!title || !!description || !!actions;

    return (
        <div className={cn("space-y-5", className)}>
            {showToolbar ? (
                <TableToolbar
                    search={filters?.search}
                    limit={filters?.limit}
                    sortBy={filters?.sortBy}
                    setSearch={filters?.setSearch}
                    setLimit={filters?.handleLimitChange}
                    setSortBy={filters?.setSortBy}
                    onReset={filters?.handleResetFilters}
                    columnFilters={filters?.columnFilters}
                    setFilter={filters?.setFilter}
                    defaults={filters?.defaults}
                    activeFilterCount={filters?.activeFilterCount}
                    toolbarFilters={toolbarFilters}
                    sortByOptions={sortByOptions}
                    limitOptions={limitOptions}
                    placeholder={placeholder}
                    title={title}
                    description={description}
                    icon={icon}
                    actions={actions}
                />
            ) : null}

            <div className="overflow-hidden rounded-xl border border-muted bg-white shadow-xs">
                {isFetching ? (
                    <TableLoading
                        columnCount={totalCols}
                        rowCount={loadingRows}
                        className="rounded-none border-0"
                    />
                ) : error ? (
                    <QueryError
                        error={error}
                        onRetry={onRetry}
                        title="Could not load this list"
                        className="rounded-none border-0"
                    />
                ) : !data || data.length === 0 ? (
                    <NoDataFound
                        className="rounded-none border-0"
                        {...emptyState}
                    />
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow className="h-12 border-b border-muted bg-gradient-to-b from-gray-50 to-gray-50/40 hover:bg-gray-50/50">
                                {expandable ? (
                                    <TableHead className="w-10" />
                                ) : null}
                                {columns?.map((col) => (
                                    <TableHead
                                        key={col.key as string}
                                        className={cn(
                                            "text-xs font-semibold tracking-wider text-gray-600 uppercase",
                                            columnClasses(col),
                                            col.headerClassName,
                                        )}
                                    >
                                        {col.header}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {data.map((row) => {
                                const key = rowKey(row);
                                const subRows = expandable?.getSubRows(row);
                                const hasSubRows =
                                    !!expandable && Array.isArray(subRows);
                                const isOpen = expanded.has(key);

                                return (
                                    <Fragment key={key}>
                                        <TableRow
                                            onClick={
                                                onRowClick
                                                    ? () => onRowClick(row)
                                                    : undefined
                                            }
                                            className={cn(
                                                "border-b border-muted/60 transition-colors last:border-0 hover:bg-muted/20",
                                                isOpen && "bg-muted/20",
                                                onRowClick && "cursor-pointer",
                                                rowClassName?.(row),
                                            )}
                                        >
                                            {expandable ? (
                                                <TableCell className="w-10">
                                                    {hasSubRows ? (
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                toggle(key);
                                                            }}
                                                            aria-label={
                                                                isOpen
                                                                    ? "Collapse row"
                                                                    : "Expand row"
                                                            }
                                                            aria-expanded={
                                                                isOpen
                                                            }
                                                            className={cn(
                                                                "flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-primary-100/70 hover:text-primary-700",
                                                                isOpen &&
                                                                    "bg-primary-100/70 text-primary-700",
                                                            )}
                                                        >
                                                            <ChevronRight
                                                                className={cn(
                                                                    "size-4 transition-transform duration-200",
                                                                    isOpen &&
                                                                        "rotate-90",
                                                                )}
                                                            />
                                                        </button>
                                                    ) : null}
                                                </TableCell>
                                            ) : null}

                                            {columns.map((col) => (
                                                <TableCell
                                                    key={col.key as string}
                                                    className={columnClasses(
                                                        col,
                                                    )}
                                                >
                                                    {col.cell
                                                        ? col.cell(row)
                                                        : ((
                                                              row as Record<
                                                                  string,
                                                                  unknown
                                                              >
                                                          )[
                                                              col.key as string
                                                          ] as ReactNode)}
                                                </TableCell>
                                            ))}
                                        </TableRow>

                                        {hasSubRows && isOpen ? (
                                            <TableRow className="hover:bg-transparent">
                                                <TableCell
                                                    colSpan={totalCols}
                                                    className="p-0"
                                                >
                                                    <DataTableSubRows<S>
                                                        rows={subRows ?? []}
                                                        columns={
                                                            expandable.subColumns
                                                        }
                                                        rowKey={(sub) =>
                                                            expandable.subRowKey(
                                                                sub,
                                                                row,
                                                            )
                                                        }
                                                        title={expandable.title?.(
                                                            row,
                                                        )}
                                                        emptyMessage={
                                                            expandable.emptyMessage
                                                        }
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ) : null}
                                    </Fragment>
                                );
                            })}
                        </TableBody>
                    </Table>
                )}
            </div>

            {showPagination ? (
                <Pagination
                    currentPage={filters.currentPage}
                    onPageChange={filters.setCurrentPage}
                    totalPages={meta.totalPages}
                    hasNextPage={meta.hasNextPage}
                    hasPreviousPage={meta.hasPreviousPage}
                    limit={Number(filters.limit)}
                    totalData={meta.totalData}
                />
            ) : null}
        </div>
    );
}
