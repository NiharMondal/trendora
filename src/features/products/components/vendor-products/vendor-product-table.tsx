"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import {
    useDeleteProductMutation,
    useMyVendorProductsQuery,
    useSetProductPublishedMutation,
    useSubmitProductForReviewMutation,
} from "@/features/products/api/product.api";
import { TProduct } from "@/features/products/types/product.types";
import { DataTable, TableLoading } from "@/shared/components/table";
import TDButton from "@/shared/components/td-button";
import { TDModal } from "@/shared/components/td-modal";
import { allSortOptions } from "@/shared/constants/sort-options";
import { useTableFilters } from "@/shared/hooks/use-table-filters";
import { Button } from "@/shared/ui/button";

import { vendorProductColumns } from "./vendor-product-columns";

const apiMessage = (error: unknown) =>
    (error as { data?: { message?: string } })?.data?.message;

/**
 * The seller's own catalogue, in every moderation state.
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
    const filters = useTableFilters({ defaultSortBy: "createdAt:desc" });
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const { data, isLoading, isFetching } = useMyVendorProductsQuery(
        filters.queryParams as Record<string, string>,
    );

    const [submitForReview, { isLoading: isSubmitting }] =
        useSubmitProductForReviewMutation();
    const [setPublished, { isLoading: isPublishing }] =
        useSetProductPublishedMutation();
    const [deleteProduct, { isLoading: isDeleting }] =
        useDeleteProductMutation();

    const handleSubmitForReview = async (id: string) => {
        try {
            await submitForReview(id).unwrap();
            toast.success("Sent for review");
        } catch (error) {
            toast.error(apiMessage(error) ?? "Could not submit for review");
        }
    };

    const handleTogglePublished = async (product: TProduct) => {
        try {
            await setPublished({
                id: product.id,
                isPublished: !product.isPublished,
            }).unwrap();
            toast.success(
                product.isPublished
                    ? "Hidden from the storefront"
                    : "Now live on the storefront",
            );
        } catch (error) {
            toast.error(apiMessage(error) ?? "Could not change visibility");
        }
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            await deleteProduct(deleteId).unwrap();
            toast.success("Product deleted");
            setDeleteId(null);
        } catch (error) {
            toast.error(apiMessage(error) ?? "Could not delete product");
        }
    };

    if (isLoading) return <TableLoading />;

    return (
        <div className="space-y-5 bg-white p-5 rounded-md">
            <div className="flex items-center justify-between">
                <div>
                    <h5 className="text-lg font-semibold">My products</h5>
                    <p className="text-sm text-muted-foreground">
                        A listing goes live once it is approved and published.
                    </p>
                </div>
                <Link href={addHref}>
                    <Button>Add product</Button>
                </Link>
            </div>

            <DataTable
                columns={vendorProductColumns({
                    onSubmitForReview: handleSubmitForReview,
                    onTogglePublished: handleTogglePublished,
                    onDelete: setDeleteId,
                    editHref,
                    isMutating: isSubmitting || isPublishing,
                })}
                data={data?.result || []}
                rowKey={(row) => row.id}
                isFetching={isFetching}
                filters={filters}
                meta={data?.meta}
                sortByOptions={allSortOptions}
                placeholder="Search your products..."
            />

            <TDModal
                open={!!deleteId}
                onOpenChange={(open) => !open && setDeleteId(null)}
                title="Delete this product?"
                description="It will be removed from your store. Past orders keep their record of it."
            >
                <div className="flex justify-end gap-2 mt-4">
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
