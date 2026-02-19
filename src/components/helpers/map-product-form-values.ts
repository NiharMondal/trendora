import type { TProductFormValues } from "@/form-schema/product-schema";
import type { TProduct } from "@/types/product.types";

export const mapProductToFormValues = (
    product: TProduct,
): TProductFormValues => {
    return {
        name: product.name,
        description: product.description,

        basePrice: Number(product.basePrice),

        discountPrice: product.discountPrice
            ? Number(product.discountPrice)
            : undefined,

        stockQuantity: product.stockQuantity,

        isFeatured: product.isFeatured ?? false,

        categoryId: product.categoryId,
        brandId: product.brandId,
        gender: product?.gender,
        variants: product.variants 
            .filter((v) => !v.isDeleted)
            .map((v) => ({
                size: v.size,
                color: v.color,
                stock: v.stock,
                price: Number(v.price),
            })),

        images: product.images
            .filter((img) => !img.isDeleted)
            .map((img) => ({
                url: img.url,
                isMain: img.isMain,
            })),
    };
};
