"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

interface TableLoadingProps {
    columnCount?: number;
    rowCount?: number;
    showHeaders?: boolean;
    className?: string;
}

export default function TableLoading({
    columnCount = 5,
    rowCount = 5,
    showHeaders = true,
    className,
}: TableLoadingProps) {
    return (
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
}
