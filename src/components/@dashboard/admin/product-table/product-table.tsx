"use client";

import Pagination from "@/components/common/pagination";
import TDButton from "@/components/common/td-button";
import { allSortOptions } from "@/components/helpers/sort-options";
import { TDModal } from "@/components/package/TDModal";
import { Button } from "@/components/ui/button";
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
    const [sortBy, setSortBy] = useState("createdAt:desc");

    const [deleteProductId, setDeleteProductId] = useState<string | null>(null);

    const [deleteProduct, { isLoading: isDeleting }] =
        useDeleteProductMutation();

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

    const confirmDelete = async () => {
        if (!deleteProductId) return;
        try {
            await deleteProduct(deleteProductId).unwrap();
            toast.success("Product deleted successfully");
            setDeleteProductId(null);
        } catch (error: any) {
            toast.error(error?.data?.message);
        }
    };
    const handleDeleteProduct = async (id: string) => {
        setDeleteProductId(id);
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
                sortByOptions={allSortOptions}
                placeholder="Search by product name..."
            />

            <DataTable
                columns={productColumns(handleDeleteProduct)}
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

            <TDModal
                open={!!deleteProductId}
                onOpenChange={(open) => !open && setDeleteProductId(null)}
                title="Are you sure you want to delete this product?"
                description="This action cannot be undone."
            >
                <div className="flex justify-end gap-2 mt-4">
                    <Button
                        variant="outline"
                        onClick={() => setDeleteProductId(null)}
                    >
                        Cancel
                    </Button>
                    <TDButton
                        variant="destructive"
                        onClick={confirmDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? "Deleting..." : "Delete"}
                    </TDButton>
                </div>
            </TDModal>
        </div>
    );
}
