import { TProduct } from "@/features/products/types/product.types";

/**
 * On the storefront only when approved AND published (and its store is
 * approved — not visible on a product row, so a suspended store's listing
 * still reads as live). `/products/:slug` 404s otherwise, so a storefront
 * link should only be offered when this is true.
 */
export const isProductLive = (product: Pick<TProduct, "status" | "isPublished">) =>
    product.status === "APPROVED" && product.isPublished;
