"use client";

import { useState } from "react";
import { toast } from "sonner";

import { DataTable, TableLoading } from "@/shared/components/table";
import TDButton from "@/shared/components/td-button";
import { allSortOptions } from "@/shared/constants/sort-options";
import { TDModal } from "@/shared/components/td-modal";
import { Button } from "@/shared/ui/button";
import {
    useAllProductsForAdminQuery,
    useDeleteProductMutation,
} from "@/features/products/api/product.api";

import { useTableFilters } from "@/shared/hooks/use-table-filters";
import { productColumns } from "./product-columns";

export default function ProductTable() {
    const filters = useTableFilters({ defaultSortBy: "createdAt:desc" });

    const [deleteProductId, setDeleteProductId] = useState<string | null>(null);

    const [deleteProduct, { isLoading: isDeleting }] =
        useDeleteProductMutation();

    // Admin endpoint: `/products` only returns approved+published listings,
    // so the admin catalogue would silently hide every draft and rejection.
    const {
        data: products,
        isLoading,
        isFetching,
    } = useAllProductsForAdminQuery(
        filters.queryParams as Record<string, string>,
    );

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
            <DataTable
                columns={productColumns(handleDeleteProduct)}
                data={products?.result || []}
                rowKey={(row) => row.id}
                isFetching={isFetching}
                filters={filters}
                meta={products?.meta}
                sortByOptions={allSortOptions}
                placeholder="Search by product name..."
            />

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
