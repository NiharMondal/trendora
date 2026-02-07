import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { DataTableProps } from "@/types/table.types";

export function DataTable<T>({
    data,
    columns,
    rowKey,
    rowClassName,
}: DataTableProps<T>) {
    return (
        <Table>
            <TableHeader>
                <TableRow className="bg-gray-100 h-20 rounded-md">
                    {columns.map((col, index) => (
                        <TableHead
                            key={col.key as string}
                            className={cn(
                                index === 0 && "rounded-tl-md",
                                index === columns.length - 1 && "rounded-tr-md",
                            )}
                        >
                            {col.header}
                        </TableHead>
                    ))}
                </TableRow>
            </TableHeader>

            <TableBody>
                {data?.map((row) => (
                    <TableRow key={rowKey(row)} className={rowClassName?.(row)}>
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
    );
}
