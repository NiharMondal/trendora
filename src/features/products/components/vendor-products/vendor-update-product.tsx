"use client";
import { CircleAlert } from "lucide-react";
import { toast } from "sonner";

import {
    useMyVendorProductByIdQuery,
    useSubmitProductForReviewMutation,
    useUpdateProductMutation,
} from "@/features/products/api/product.api";
import ProductForm from "@/features/products/components/product-form/product-form";
import { TProductFormValues } from "@/features/products/schemas/product-form.schema";
import { mapProductToFormValues } from "@/features/products/utils/map-product-form-values";
import SpinnerLoading from "@/shared/components/loading/spinner-loading";
import NoDataFound from "@/shared/components/no-data-found";
import QueryError from "@/shared/components/query-error";
import TDButton from "@/shared/components/td-button";
import { getApiErrorMessage } from "@/shared/utils/api-error";

/**
 * A vendor editing their own listing.
 *
 * Reads through `/products/vendor/my-products/:id` so a DRAFT or REJECTED
 * listing is loadable — the public `/products/:id` would 404 on those.
 *
 * Editing a material field (name, description, category, brand, gender,
 * images) on an APPROVED listing sends it back to the review queue; price and
 * stock edits do not. The toast says so, because a listing quietly
 * disappearing from the storefront after an edit is alarming otherwise.
 */
export default function VendorUpdateProduct({ id }: { id: string }) {
    const {
        data,
        isLoading,
        error: loadError,
        refetch: retryLoad,
    } = useMyVendorProductByIdQuery(id);
    const [updateProduct, { isLoading: isUpdating }] =
        useUpdateProductMutation();
    const [submitForReview, { isLoading: isSubmitting }] =
        useSubmitProductForReviewMutation();

    if (isLoading) return <SpinnerLoading />;
    if (loadError) {
        return (
            <QueryError
                error={loadError}
                onRetry={retryLoad}
                title="Could not load this product"
                notFound={{
                    title: "Product not found",
                    description:
                        "It may have been deleted, or it belongs to another store.",
                }}
            />
        );
    }

    const product = data?.result;

    if (!product) {
        return (
            <NoDataFound
                title="Product not found"
                description="It may have been deleted, or it belongs to another store."
            />
        );
    }

    // Shared mapper — it carries variant/image ids through, which is what
    // stops an edit from deleting and recreating the product's media.
    const defaultValues = mapProductToFormValues(product);

    // Saving a REJECTED listing leaves it REJECTED — only an APPROVED one is
    // re-queued by an edit — so resubmitting is its own, explicit step.
    const handleResubmit = async () => {
        try {
            await submitForReview(id).unwrap();
            toast.success("Sent for review");
        } catch (error: unknown) {
            toast.error(getApiErrorMessage(error, "Could not submit for review"));
        }
    };

    const handleUpdate = async (values: TProductFormValues) => {
        try {
            const updated = await updateProduct({ payload: values, id }).unwrap();

            if (
                product.status === "APPROVED" &&
                updated.result?.status === "PENDING"
            ) {
                toast.success(
                    "Product updated — sent back for review because a material field changed",
                );
            } else {
                toast.success("Product updated successfully");
            }
        } catch (error: unknown) {
            const message = (error as { data?: { message?: string } })?.data
                ?.message;
            toast.error(message ?? "Could not update product");
        }
    };

    return (
        <div className="space-y-5">
            {/* The list shows the reason too, but this is where the seller
                fixes the listing, so it is repeated beside the form. */}
            {product.status === "REJECTED" && (
                <div
                    role="status"
                    className="flex flex-col gap-3 rounded-md border border-destructive-100 bg-destructive-50 p-4 text-sm sm:flex-row sm:items-start"
                >
                    <CircleAlert className="size-5 shrink-0 text-destructive-600" />
                    <div className="flex-1 space-y-1">
                        <p className="font-medium text-destructive-600">
                            This listing was rejected
                        </p>
                        <p>
                            {product.rejectionReason ??
                                "No reason was given."}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Fix what the reviewer flagged and save, then submit
                            it for review again.
                        </p>
                    </div>
                    <TDButton
                        type="button"
                        size="sm"
                        isLoading={isSubmitting}
                        onClick={handleResubmit}
                    >
                        Submit for review
                    </TDButton>
                </div>
            )}
            <ProductForm
                productId={id}
                defaultValues={defaultValues}
                onSubmit={handleUpdate}
                isLoading={isUpdating}
            />
        </div>
    );
}
