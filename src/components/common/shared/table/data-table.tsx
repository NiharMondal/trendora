"use client";

import NoDataFound from "@/components/common/shared/no-data-found";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Fragment, useState } from "react";

import DataTableSubRows from "./data-table-sub-rows";
import TableLoading from "./table-loading";
import { DataTableProps } from "./table-types";
import { Button } from "@/components/ui/button";

export default function TableData<T, S = unknown>({
    data,
    columns,
    rowKey,
    rowClassName,
    isFetching,
    expandable,
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

    if (isFetching) return <TableLoading />;

    const totalCols = columns.length + (expandable ? 1 : 0);

    return (
        <div className="space-y-4">
            <div className="bg-white rounded-md overflow-hidden">
                {!data || data.length === 0 ? (
                    <NoDataFound />
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50/50 h-16 hover:bg-gray-50/50">
                                {expandable ? (
                                    <TableHead className="w-10" />
                                ) : null}
                                {columns?.map((col) => (
                                    <TableHead
                                        key={col.key as string}
                                        className={cn(
                                            "font-semibold text-gray-700",
                                            col.className,
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
                                            className={cn(
                                                "hover:bg-gray-50/50 transition-colors",
                                                rowClassName?.(row),
                                            )}
                                        >
                                            {expandable ? (
                                                <TableCell className="w-10">
                                                    {hasSubRows ? (
                                                        <Button
                                                            type="button"
                                                            variant="link"
                                                            size="icon-sm"
                                                            onClick={() =>
                                                                toggle(key)
                                                            }
                                                            aria-label={
                                                                isOpen
                                                                    ? "Collapse row"
                                                                    : "Expand row"
                                                            }
                                                            aria-expanded={
                                                                isOpen
                                                            }
                                                        >
                                                            {isOpen ? (
                                                                <ChevronDown className="h-4 w-4" />
                                                            ) : (
                                                                <ChevronRight className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                    ) : null}
                                                </TableCell>
                                            ) : null}

                                            {columns.map((col) => (
                                                <TableCell
                                                    key={col.key as string}
                                                    className={col.className}
                                                >
                                                    {col.cell
                                                        ? col.cell(row)
                                                        : (row as any)[col.key]}
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
        </div>
    );
}
