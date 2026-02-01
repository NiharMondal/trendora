"use client";

import Sorting from "@/components/common/sorting/sorting";
import {
    useAllProductsQuery,
    useDeleteProductMutation,
} from "@/redux/api/productApi";
import { DataTable } from "@/shared/data-table";
import { useState } from "react";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";
import { productColumns } from "./product-columns";

export default function ProductTable() {
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState("10");
    const [search, setSearch] = useState("");
    const [value] = useDebounce(search, 1000);

    const [deleteProduct] = useDeleteProductMutation();
    const { data: products, isLoading } = useAllProductsQuery({
        search: value,
        limit: limit,
        page: currentPage.toString(),
    });

    const handleDelete = async (id: string) => {
        try {
            await deleteProduct(id).unwrap();
            toast.success("Product deleted successfully");
        } catch (error: any) {
            toast.error(error?.data?.message);
        }
    };

    return (
        <div className="space-y-5 bg-white p-5 rounded-md">
            <Sorting setSearch={setSearch} setLimit={setLimit} />
            <DataTable
                columns={productColumns}
                data={products?.result || []}
                rowKey={(row) => row.id}
                isLoading={isLoading}
                pagination={{
                    total: products?.meta?.totalPages || 0,
                    page: currentPage,
                    limit: Number(limit),
                    onPageChange: setCurrentPage,
                    onLimitChange: (val) => setLimit(val.toString()),
                }}
            />
        </div>
    );
}
