export type TCartProduct = {
    productId: string;
    productName: string;
    productImage?: string | undefined;
    variantId?: string | null;
    quantity: number;
    price: number;
};
