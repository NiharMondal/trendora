"use client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useCreateProductMutation } from "@/features/products/api/product.api";
import ProductForm from "@/features/products/components/product-form/product-form";
import { TProductFormValues } from "@/features/products/schemas/product-form.schema";

/**
 * A vendor creating a listing.
 *
 * No store picker: the backend assigns the caller's own store and ignores any
 * `vendorId` sent by a vendor. The new listing is a DRAFT unless the seller
 * ticks "submit for review", and is not visible to shoppers either way until
 * it has been approved and published.
 */
export default function VendorCreateProduct() {
    const router = useRouter();
    const [createProduct, { isLoading }] = useCreateProductMutation();

    const handleCreateProduct = async (values: TProductFormValues) => {
        try {
            await createProduct(values).unwrap();
            toast.success(
                values.submitForReview
                    ? "Product created and sent for review"
                    : "Product saved as a draft",
            );
            router.push("/vendor/products");
        } catch (error: unknown) {
            const message = (error as { data?: { message?: string } })?.data
                ?.message;
            toast.error(message ?? "Could not create product");
        }
    };

    return (
        <ProductForm
            onSubmit={handleCreateProduct}
            isLoading={isLoading}
            showSubmitForReview
        />
    );
}
