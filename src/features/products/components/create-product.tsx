"use client";
import { toast } from "sonner";

import ProductForm from "@/features/products/components/product-form/product-form";
import { TProductFormValues } from "@/features/products/schemas/product-form.schema";
import { useCreateProductMutation } from "@/features/products/api/product.api";

export default function CreateProduct() {
    const [createProduct, { isLoading }] = useCreateProductMutation();

    const handleCreateProduct = async (values: TProductFormValues) => {
        try {
            await createProduct(values).unwrap();
            toast.success("Product created successfully");
        } catch (error: any) {
            console.log(error);
            toast.error(error?.data.message);
        }
    };
    return <ProductForm onSubmit={handleCreateProduct} isLoading={isLoading} />;
}
