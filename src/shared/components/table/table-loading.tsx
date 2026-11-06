"use client";

import { motion } from "motion/react";

import { Skeleton } from "@/shared/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/ui/table";
import { cn } from "@/shared/lib/utils";

interface TableLoadingProps {
    columnCount?: number;
    rowCount?: number;
    showHeaders?: boolean;
    /** Skeleton of the search / sort / limit row above the table. Off inside
     *  `DataTable`, which renders the real toolbar over its own skeleton. */
    showToolbar?: boolean;
    className?: string;
}

export default function TableLoading({
    columnCount = 5,
    rowCount = 5,
    showHeaders = true,
    showToolbar = true,
    className,
}: TableLoadingProps) {
    const table = (
        <div className={cn("rounded-md border", className)}>
            <Table>
                {showHeaders && (
                    <TableHeader>
                        <TableRow>
                            {Array.from({ length: columnCount }).map((_, i) => (
                                <TableHead key={i}>
                                    <Skeleton className="h-6 w-24" />
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                )}
                <TableBody>
                    {Array.from({ length: rowCount }).map((_, i) => (
                        <TableRow key={i} className="hover:bg-transparent">
                            {Array.from({ length: columnCount }).map((_, j) => (
                                <TableCell key={j}>
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{
                                            duration: 0.3,
                                            delay: i * 0.05 + j * 0.02,
                                        }}
                                    >
                                        <Skeleton className="h-5 w-full max-w-[140px]" />
                                    </motion.div>
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );

    if (!showToolbar) return table;

    // Mirrors `TableToolbar`'s controls row: search on the left, sort and
    // per-page pills on the right, so the real toolbar lands without a jump.
    return (
        <div className="space-y-5">
            <div className="w-full border-b border-muted pb-3">
                <div className="grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap sm:items-center">
                    <Skeleton className="col-span-2 h-9 rounded-lg sm:w-64 lg:w-80" />
                    <span aria-hidden="true" className="hidden sm:block sm:flex-1" />
                    <Skeleton className="h-9 rounded-lg sm:w-40" />
                    <Skeleton className="h-9 rounded-lg sm:w-28" />
                </div>
            </div>
            {table}
        </div>
    );
}
