"use client";
import ProductForm from "@/components/common/form/product-form/product-form";
import { mapProductToFormValues } from "@/components/helpers/product/map-product-form-values";
import { TProductFormValues } from "@/form-schema/product-schema";
import {
    useProductByIdQuery,
    useUpdateProductMutation,
} from "@/redux/api/productApi";
import GeneralLoading from "@/shared/general-loading";
import { useMemo } from "react";
import { toast } from "sonner";

export default function UpdateProduct({ productId }: { productId: string }) {
    // get product by id
    const { data: product, isLoading: fetchLoading } =
        useProductByIdQuery(productId);

    // update product mutation
    const [updateProduct, { isLoading: updateLoading }] =
        useUpdateProductMutation();

    const defaultValues = useMemo(
        () => (product ? mapProductToFormValues(product.result) : undefined),
        [product],
    );
    console.log({defaultValues})
    const handleUpdateProduct = async (values: TProductFormValues) => {
        try {
            await updateProduct({
                id: productId,
                payload: values,
            });
            toast.success("Product updated successfully");
        } catch (error: any) {
            toast.error(error?.data?.message);
        }
    };

    if (fetchLoading) return <GeneralLoading />;
    return (
        <div>
            <ProductForm
                defaultValues={defaultValues}
                onSubmit={handleUpdateProduct}
                productId={productId}
                isLoading={updateLoading}
            />
        </div>
    );
}
