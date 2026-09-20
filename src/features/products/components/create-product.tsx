"use client";
import { toast } from "sonner";

import ProductForm from "@/features/products/components/product-form/product-form";
import { TProductFormValues } from "@/features/products/schemas/product-form.schema";
import { useCreateProductMutation } from "@/features/products/api/product.api";
import { useAllVendorsForAdminQuery } from "@/features/vendors/api/vendor.api";

/**
 * Admin creating a product.
 *
 * A product cannot exist without a store, and an admin does not own one — so
 * unlike the vendor flow this form requires an explicit store. Only APPROVED
 * stores are offered; a pending or suspended store cannot list anything.
 */
export default function CreateProduct() {
    const [createProduct, { isLoading }] = useCreateProductMutation();
    const { data: vendors } = useAllVendorsForAdminQuery({
        limit: "100",
        status: "APPROVED",
    });

    const vendorOptions =
        vendors?.result?.map((vendor) => ({
            label: vendor.storeName,
            value: vendor.id,
        })) ?? [];

    const handleCreateProduct = async (values: TProductFormValues) => {
        try {
            await createProduct(values).unwrap();
            toast.success(
                values.submitForReview
                    ? "Product created and sent for review"
                    : "Product saved as a draft",
            );
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
            vendorOptions={vendorOptions}
            showSubmitForReview
        />
    );
}
