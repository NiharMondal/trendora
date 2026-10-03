import { TProductFormValues } from "@/features/products/schemas/product-form.schema";
import type { TProduct } from "@/features/products/types/product.types";

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
        // `id` MUST be carried through: the backend keeps the variants and
        // images whose ids it receives and deletes the rest (images are
        // removed from Cloudinary too), so omitting them makes every edit
        // destroy and recreate the product's media.
        variants: product.variants
            .filter((v) => !v.isDeleted)
            .map((v) => ({
                id: v.id,
                sizeId: v.sizeId,
                color: v.color,
                stock: v.stock,
                price: Number(v.price),
            })),

        images: product.images
            .filter((img) => !img.isDeleted)
            .map((img) => ({
                id: img.id,
                url: img.url,
                publicId: img.publicId,
                altText: img.altText,
                isMain: img.isMain,
            })),
    };
};
