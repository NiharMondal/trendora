"use client";
import Pagination from "@/components/common/pagination";
import {
    useAllCategoryQuery,
    useDeleteCategoryMutation,
} from "@/redux/api/productCategoryApi";
import { DataTable, TableToolbar } from "@/shared/table";

import { useState } from "react";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";
import { categoryColumns } from "./category-columns";

type Props = {};

export default function CategoryTable({}: Props) {
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState("10");
    const [search, setSearch] = useState("");
    const [value] = useDebounce(search, 1000);

    const { data: categories, isLoading } = useAllCategoryQuery({
        search: value,
        limit: limit,
        page: currentPage.toString(),
    });

    const [deleteCategory] = useDeleteCategoryMutation();

    const handleDelete = async (id: string) => {
        try {
            await deleteCategory(id).unwrap();
            toast.success("Product deleted successfully");
        } catch (error: any) {
            toast.error(error?.data?.message);
        }
    };
    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white border border-muted p-2 rounded-md">
                <TableToolbar
                    search={search}
                    setSearch={setSearch}
                    limit={limit}
                    setLimit={(val) => setLimit(val)}
                />
            </div>
            <DataTable
                data={categories?.result || []}
                columns={categoryColumns(handleDelete)}
                isFetching={isLoading}
                rowKey={(row) => row.id}
            />
            {categories?.result && categories.result.length > 0 && (
                <Pagination
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                    totalPages={categories?.meta?.totalPages || 0}
                    limit={Number(limit)}
                    totalData={categories?.meta?.totalData || 0}
                />
            )}
        </div>
    );
}
