import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import NoDataFound from "@/shared/no-data-found";
import { DataTableProps } from "@/types/table.types";
import TableLoading from "./table-loading";
import React from 'react'

export default function TableData<T>({
    data,
    columns,
    rowKey,
    rowClassName,
    isFetching,
}: DataTableProps<T>) {
    if (isFetching) return <TableLoading />;
    return (
        <div className="space-y-4">
            <div className="bg-white rounded-md overflow-hidden">
                {!data || data.length === 0 ? (
                    <NoDataFound />
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50/50 h-16 hover:bg-gray-50/50">
                                {columns.map((col) => (
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
                            {data.map((row) => (
                                <TableRow
                                    key={rowKey(row)}
                                    className={cn(
                                        "hover:bg-gray-50/50 transition-colors",
                                        rowClassName?.(row),
                                    )}
                                >
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
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>
    );
}
