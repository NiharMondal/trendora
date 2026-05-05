import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { DataTableColumn } from "./table-types";

interface Props<S> {
    rows: S[];
    columns: DataTableColumn<S>[];
    rowKey: (sub: S) => string;
    title?: ReactNode;
    emptyMessage?: string;
}

export default function DataTableSubRows<S>({
    rows,
    columns,
    rowKey,
    title,
    emptyMessage = "No items",
}: Props<S>) {
    return (
        <div className="px-6 py-4 bg-gray-50/40 border-l-2 border-primary/50">
            {title ? (
                <div className="text-xs font-semibold tracking-wide text-gray-500 uppercase mb-2">
                    {title}
                </div>
            ) : null}

            {rows.length === 0 ? (
                <div className="text-sm text-gray-500 italic py-2">
                    {emptyMessage}
                </div>
            ) : (
                <div className="bg-white rounded-md border border-gray-100 overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-100/60 hover:bg-gray-100/60">
                                {columns.map((col) => (
                                    <TableHead
                                        key={col.key as string}
                                        className={cn(
                                            "text-xs font-semibold text-gray-600 h-10",
                                            col.className,
                                        )}
                                    >
                                        {col.header}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rows.map((sub) => (
                                <TableRow
                                    key={rowKey(sub)}
                                    className="hover:bg-gray-50/60"
                                >
                                    {columns.map((col) => (
                                        <TableCell
                                            key={col.key as string}
                                            className={cn(
                                                "py-2",
                                                col.className,
                                            )}
                                        >
                                            {col.cell
                                                ? col.cell(sub)
                                                : (sub as any)[col.key]}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}
