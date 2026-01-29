"use client";
import ProductForm from "@/components/common/product-form/product-form";
import {
    useProductByIdQuery,
    useUpdateProductMutation,
} from "@/redux/api/productApi";
import { toast } from "sonner";

export default function UpdateProduct({ productId }: { productId: string }) {
    const { data: product, isLoading: fetchLoading } =
        useProductByIdQuery(productId);

    const [updateProduct, { isLoading: updateLoading }] =
        useUpdateProductMutation();
    const defaultValues = product?.result ?? {
        name: product?.result.name,
        basePrice: product?.result.basePrice,
        discountPrice: product?.result.discountPrice || "",
        categoryId: product?.result.categoryId || "",
        description: product?.result.description || "",
        stockQuantity: product?.result.stockQuantity,
        isFeatured: product?.result.isFeatured,
        brandId: product?.result.brandId || "",
        variants: product?.result.variants.map((variant) => ({
            stock: variant.stock,
            price: variant.price,
            color: variant.color,
            size: variant.size,
        })),
        images: product?.result.images.map((image) => ({
            isMain: image.isMain,
            url: image.url,
        })),
    };

    const handleUpdateProduct = async (values: any) => {
        try {
            // Implement update product logic here
            console.log("Updated values:", values);
            updateProduct(values);
            toast.success("Product updated successfully");
        } catch (error: any) {
            toast.error(error?.data?.message);
        }
    };

    if (fetchLoading) return <p>Loading...</p>;
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
