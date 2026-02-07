"use client";

import Pagination from "@/components/common/pagination";
import {
    useAllProductsQuery,
    useDeleteProductMutation,
} from "@/redux/api/productApi";
import { DataTable, TableLoading, TableToolbar } from "@/shared/table";
import { useState } from "react";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";
import { productColumns } from "./product-columns";

export default function ProductTable() {
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState("10");
    const [search, setSearch] = useState("");
    const [value] = useDebounce(search, 1000);
    const [sortBy, setSortBy] = useState("createdAt:asc");
    const {
        data: products,
        isLoading,
        isFetching,
    } = useAllProductsQuery({
        search: value,
        limit: limit,
        page: currentPage.toString(),
        sortBy: sortBy,
    });
    const [deleteProduct] = useDeleteProductMutation();

    const handleDelete = async (id: string) => {
        try {
            await deleteProduct(id).unwrap();
            toast.success("Product deleted successfully");
        } catch (error: any) {
            toast.error(error?.data?.message);
        }
    };
    if (isLoading) return <TableLoading />;
    return (
        <div className="space-y-5 bg-white p-5 rounded-md">
            <TableToolbar
                search={search}
                limit={limit}
                sortBy={sortBy}
                setLimit={setLimit}
                setSortBy={setSortBy}
                setSearch={setSearch}
                sortByOptions={[
                    { label: "Asc", value: "createdAt:asc" },
                    { label: "Desc", value: "createdAt:desc" },
                    { label: "Name(asc)", value: "name:asc" },
                    { label: "Name(desc)", value: "name:desc" },
                ]}
            />

            <DataTable
                columns={productColumns}
                data={products?.result || []}
                rowKey={(row) => row.id}
                isFetching={isFetching}
            />
            {products?.result && products.result.length > 10 && (
                <Pagination
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                    totalPages={products?.meta?.totalPages || 0}
                    limit={Number(limit)}
                    totalData={products?.meta?.totalData || 0}
                />
            )}
        </div>
    );
}
