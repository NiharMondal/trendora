"use client";
import { useMemo } from "react";
import { toast } from "sonner";

import ProductForm from "@/features/products/components/product-form/product-form";
import { TProductFormValues } from "@/features/products/schemas/product-form.schema";
import GeneralLoading from "@/shared/components/loading/general-loading";
import { mapProductToFormValues } from "@/features/products/utils/map-product-form-values";
import {
    useMyVendorProductByIdQuery,
    useUpdateProductMutation,
} from "@/features/products/api/product.api";
import QueryError from "@/shared/components/query-error";
import { getApiErrorMessage } from "@/shared/utils/api-error";

export default function UpdateProduct({ productId }: { productId: string }) {
    // Read through the vendor/admin endpoint, not the public one: an ADMIN
    // gets any product from it, whereas `/products/:id` applies the storefront
    // visibility filter and 404s on a DRAFT, PENDING or REJECTED listing.
    const {
        data: product,
        isLoading: fetchLoading,
        error: loadError,
        refetch: retryLoad,
    } = useMyVendorProductByIdQuery(productId);

    // update product mutation
    const [updateProduct, { isLoading: updateLoading }] =
        useUpdateProductMutation();

    const defaultValues = useMemo(
        () => (product ? mapProductToFormValues(product.result) : undefined),
        [product],
    );

    const handleUpdateProduct = async (values: TProductFormValues) => {
        try {
            await updateProduct({
                id: productId,
                payload: values,
            });
            toast.success("Product updated successfully");
        } catch (error) {
            toast.error(getApiErrorMessage(error));
        }
    };

    if (fetchLoading) return <GeneralLoading />;
    if (loadError) {
        return (
            <QueryError
                error={loadError}
                onRetry={retryLoad}
                title="Could not load this product"
                notFound={{
                    title: "Product not found",
                    description:
                        "It may have been deleted, or the link is wrong.",
                }}
            />
        );
    }
    return (
        <div>
            <ProductForm
                defaultValues={defaultValues}
                onSubmit={handleUpdateProduct}
                productId={productId}
                isLoading={updateLoading}
                showFeatured
            />
        </div>
    );
}
