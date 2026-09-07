import type { TProduct } from "@/features/products/types/product.types";

export type TWishlist = {
    id: string;
    userId: string;
    productId: string;
    slug:string;
    product: TProduct;
    createdAt: string;
    updatedAt: string;
};
