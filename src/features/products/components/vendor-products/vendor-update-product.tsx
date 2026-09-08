"use client";
import { toast } from "sonner";

import {
    useMyVendorProductByIdQuery,
    useUpdateProductMutation,
} from "@/features/products/api/product.api";
import ProductForm from "@/features/products/components/product-form/product-form";
import { TProductFormValues } from "@/features/products/schemas/product-form.schema";
import { mapProductToFormValues } from "@/features/products/utils/map-product-form-values";
import SpinnerLoading from "@/shared/components/loading/spinner-loading";
import NoDataFound from "@/shared/components/no-data-found";

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
    const { data, isLoading } = useMyVendorProductByIdQuery(id);
    const [updateProduct, { isLoading: isUpdating }] =
        useUpdateProductMutation();

    if (isLoading) return <SpinnerLoading />;

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
        <ProductForm
            productId={id}
            defaultValues={defaultValues}
            onSubmit={handleUpdate}
            isLoading={isUpdating}
        />
    );
}
