"use client";
import {
    useAllCategoryQuery,
    useDeleteCategoryMutation,
} from "@/redux/api/productCategoryApi";
import { DataTable } from "@/shared/data-table";
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
        <div>
            <DataTable
                data={categories?.result || []}
                columns={categoryColumns(handleDelete)}
                isLoading={isLoading}
                rowKey={(row) => row.id}
                search={{
                    value: search,
                    onChange: setSearch,
                }}
                pagination={{
                    total: categories?.meta?.totalPages || 0,
                    page: currentPage,
                    limit: Number(limit),
                    onPageChange: setCurrentPage,
                    onLimitChange: (val) => setLimit(val.toString()),
                }}
            />
        </div>
    );
}
