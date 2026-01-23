import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { DataTableProps } from "@/types/table.types";

export function TDTable<T>({
    data,
    columns,
    rowKey,
    rowClassName,
}: DataTableProps<T>) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    {columns.map((col) => (
                        <TableHead key={col.key as string}>
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
