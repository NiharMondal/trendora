"use client";
import ProductForm from "@/components/common/form/product-form/product-form";
import { TProductFormValues } from "@/form-schema/product-schema";
import { useCreateProductMutation } from "@/redux/api/productApi";
import { toast } from "sonner";

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
