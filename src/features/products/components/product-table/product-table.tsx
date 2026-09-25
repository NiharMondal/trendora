"use client";

import { Boxes, Package, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { DataTable, TableLoading } from "@/shared/components/table";
import TDButton from "@/shared/components/td-button";
import { adminProductSortOptions } from "@/shared/constants/sort-options";
import { TDModal } from "@/shared/components/td-modal";
import { Button } from "@/shared/ui/button";
import {
    useAllProductsForAdminQuery,
    useDeleteProductMutation,
} from "@/features/products/api/product.api";
import FeaturedSummary from "@/features/products/components/featured/featured-summary";
import { useAdminProductFilters } from "@/features/products/hooks/use-admin-product-filters";

import { productColumns } from "./product-columns";
import { getApiErrorMessage } from "@/shared/utils/api-error";

/**
 * The admin catalogue. With `featuredOnly` it is the Products → Featured tab:
 * the same table pre-filtered to featured listings, under a preview of what
 * the home page's Featured rail is showing right now. Featuring itself is a
 * per-row action in both views — there is no separate screen for it.
 */
export default function ProductTable({
    featuredOnly = false,
}: {
    featuredOnly?: boolean;
}) {
    const { filters, toolbarFilters } = useAdminProductFilters({
        featuredOnly,
    });

    const [deleteProductId, setDeleteProductId] = useState<string | null>(null);

    const [deleteProduct, { isLoading: isDeleting }] =
        useDeleteProductMutation();

    // Admin endpoint: `/products` only returns approved+published listings,
    // so the admin catalogue would silently hide every draft and rejection.
    const {
        data: products,
        isLoading,
        isFetching,
        error: listError,
        refetch: refetchList,
    } = useAllProductsForAdminQuery(
        filters.queryParams as Record<string, string>,
    );

    const confirmDelete = async () => {
        if (!deleteProductId) return;
        try {
            await deleteProduct(deleteProductId).unwrap();
            toast.success("Product deleted successfully");
            setDeleteProductId(null);
        } catch (error) {
            toast.error(getApiErrorMessage(error));
        }
    };
    const handleDeleteProduct = async (id: string) => {
        setDeleteProductId(id);
    };

    if (isLoading) return <TableLoading />;

    return (
        <div className="space-y-5">
            {featuredOnly && <FeaturedSummary />}

            <div className="space-y-5 bg-white p-5 rounded-md">
                <DataTable
                    title={
                        featuredOnly ? "Featured products" : "Product catalogue"
                    }
                    description={
                        featuredOnly
                            ? "Everything starred for the home page. A listing that is not live yet appears there once it is approved and published."
                            : "Every listing from every store, including drafts and rejections."
                    }
                    icon={featuredOnly ? Star : Package}
                    // Separate keys: the Featured tab has no use for the
                    // Featured column, so the two views remember their own set.
                    columnConfig={{
                        storageKey: featuredOnly
                            ? "admin-products-featured"
                            : "admin-products",
                    }}
                    toolbarFilters={toolbarFilters}
                    emptyState={{
                        icon: featuredOnly ? Star : Boxes,
                        title: filters.isFiltered
                            ? "No products match these filters"
                            : featuredOnly
                              ? "Nothing is featured yet"
                              : "No products yet",
                        description: filters.isFiltered
                            ? "Try clearing a filter or two."
                            : featuredOnly
                              ? "Star a product in All Products to feature it on the home page."
                              : "Products appear here as soon as a store creates one.",
                        ...(filters.isFiltered && {
                            actionLabel: "Clear all filters",
                            onAction: filters.handleResetFilters,
                        }),
                    }}
                    columns={productColumns(handleDeleteProduct)}
                    data={products?.result || []}
                    rowKey={(row) => row.id}
                    error={listError}
                    onRetry={refetchList}
                    isFetching={isFetching}
                    filters={filters}
                    meta={products?.meta}
                    sortByOptions={adminProductSortOptions}
                    // The admin list searches name and description.
                    placeholder="Search by name or description..."
                />
            </div>

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
