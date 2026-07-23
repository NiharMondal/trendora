import { TProduct } from "./product.types";

export type TWishlist = {
    id: string;
    userId: string;
    productId: string;
    slug:string;
    product: TProduct;
    createdAt: string;
    updatedAt: string;
};
