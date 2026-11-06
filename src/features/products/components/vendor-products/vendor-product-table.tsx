"use client";

import { Boxes, Package, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import {
    useDeleteProductMutation,
    useMyVendorProductsQuery,
} from "@/features/products/api/product.api";
import { useVendorProductFilters } from "@/features/products/hooks/use-vendor-product-filters";
import { TProduct } from "@/features/products/types/product.types";
import { DataTable, TableLoading } from "@/shared/components/table";
import TDButton from "@/shared/components/td-button";
import { TDModal } from "@/shared/components/td-modal";
import { productTableSortOptions } from "@/shared/constants/sort-options";
import { Button } from "@/shared/ui/button";
import { getApiErrorMessage } from "@/shared/utils/api-error";

import { vendorProductColumns } from "./vendor-product-columns";

/**
 * The seller's own catalogue, in every moderation state — the same
 * `DataTable`, filter panel and column menu as the admin catalogue, with the
 * seller's columns and actions (`vendor-product-columns.tsx`).
 *
 * Uses `/products/vendor/my-products` rather than `/products`, because the
 * public listing only returns approved+published rows — a seller has to be
 * able to see their own drafts and rejections.
 */
export default function VendorProductTable({
    editHref = (product: TProduct) => `/vendor/products/${product.id}`,
    addHref = "/vendor/products/add",
}: {
    editHref?: (product: TProduct) => string;
    addHref?: string;
}) {
    const { filters, toolbarFilters } = useVendorProductFilters();
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const {
        data,
        isLoading,
        isFetching,
        error: listError,
        refetch: refetchList,
    } = useMyVendorProductsQuery(
        filters.queryParams as Record<string, string>,
    );

    const [deleteProduct, { isLoading: isDeleting }] =
        useDeleteProductMutation();

    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            await deleteProduct(deleteId).unwrap();
            toast.success("Product deleted");
            setDeleteId(null);
        } catch (error) {
            toast.error(getApiErrorMessage(error, "Could not delete product"));
        }
    };

    if (isLoading) return <TableLoading />;

    return (
        <div className="space-y-5 rounded-md bg-white p-5">
            <DataTable
                title="My products"
                description="A listing goes live once it is approved and you publish it."
                icon={Package}
                actions={
                    <Button size="sm" className="h-9" asChild>
                        <Link href={addHref}>
                            <Plus />
                            Add product
                        </Link>
                    </Button>
                }
                columnConfig={{ storageKey: "vendor-products" }}
                toolbarFilters={toolbarFilters}
                columns={vendorProductColumns({ onDelete: setDeleteId, editHref })}
                data={data?.result || []}
                rowKey={(row) => row.id}
                error={listError}
                onRetry={refetchList}
                isFetching={isFetching}
                filters={filters}
                meta={data?.meta}
                sortByOptions={productTableSortOptions}
                // The seller's list searches name and description.
                placeholder="Search your products..."
                emptyState={{
                    icon: Boxes,
                    title: filters.isFiltered
                        ? "No products match these filters"
                        : "You have no products yet",
                    description: filters.isFiltered
                        ? "Try clearing a filter or two."
                        : "Add your first product, then submit it for review.",
                    ...(filters.isFiltered
                        ? {
                              actionLabel: "Clear all filters",
                              onAction: filters.handleResetFilters,
                          }
                        : {}),
                }}
            />

            <TDModal
                open={!!deleteId}
                onOpenChange={(open) => !open && setDeleteId(null)}
                title="Delete this product?"
                description="It will be removed from your store. Past orders keep their record of it."
            >
                <div className="mt-4 flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setDeleteId(null)}>
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
