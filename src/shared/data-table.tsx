import Pagination from "@/components/common/pagination";
import TableLoadingSkeleton from "@/components/common/table-loading-skeleton";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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

export function DataTable<T>({
    data,
    columns,
    rowKey,
    rowClassName,
    isLoading,
    search,
    pagination,
}: DataTableProps<T>) {
    if (isLoading) {
        return <TableLoadingSkeleton />;
    }

    const showHeader = search || (pagination && pagination.total > 0);

    return (
        <div className="space-y-4">
            {showHeader && (
                <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white p-5 rounded-md border border-muted">
                    <div className="flex items-center justify-between w-full md:max-w-fit">
                        {pagination && (
                            <div className="flex gap-x-2 items-center">
                                <p className="text-xs text-muted-foreground whitespace-nowrap">
                                    Showing
                                </p>
                                <Select
                                    value={pagination.limit.toString()}
                                    onValueChange={(val) =>
                                        pagination.onLimitChange(Number(val))
                                    }
                                >
                                    <SelectTrigger className="w-[80px] h-8">
                                        <SelectValue placeholder="Limit" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="10">10</SelectItem>
                                        <SelectItem value="20">20</SelectItem>
                                        <SelectItem value="30">30</SelectItem>
                                        <SelectItem value="50">50</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>
                    {search && (
                        <Input
                            placeholder={search.placeholder || "Search here..."}
                            className="max-w-sm h-9"
                            value={search.value}
                            onChange={(e) => search.onChange(e.target.value)}
                        />
                    )}
                </div>
            )}

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

            {pagination && pagination.total > 0 && (
                <div className="flex items-center justify-between px-2">
                    <p className="max-w-fit text-xs text-muted-foreground tracking-wide">
                        Showing {(pagination.page - 1) * pagination.limit + 1}-
                        {Math.min(
                            pagination.page * pagination.limit,
                            pagination.total,
                        )}{" "}
                        of {pagination.total} items
                    </p>
                    <Pagination
                        currentPage={pagination.page}
                        onPageChange={pagination.onPageChange}
                        totalPages={Math.ceil(
                            pagination.total / pagination.limit,
                        )}
                    />
                </div>
            )}
        </div>
    );
}
