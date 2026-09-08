import { TCartItem } from "@/features/cart/types/cart.types";
import { TProduct } from "@/features/products/types/product.types";

/**
 * The single place a cart line is built from a product.
 *
 * Every "add to cart" button must go through this, because a cart line now has
 * to carry its owning store: shipping is charged per store, so the cart cannot
 * group or price itself without it. Three call sites used to assemble this
 * object by hand (product card, product details, wishlist card) and any one of
 * them forgetting the store snapshot would silently produce a wrong total.
 */
export function toCartItem(
    product: TProduct | undefined,
    options: {
        quantity?: number;
        /** Set when a specific variant was chosen. */
        variantId?: string | null;
        /** Variant price, if a variant was chosen. */
        variantPrice?: string | number | null;
        /** Overrides the derived main image. */
        productImage?: string;
    } = {},
): TCartItem {
    const { quantity = 1, variantId, variantPrice, productImage } = options;

    const mainImage =
        productImage ??
        product?.images?.find((image) => image.isMain)?.url ??
        product?.images?.[0]?.url;

    const basePrice = product?.discountPrice
        ? product.discountPrice
        : product?.basePrice;

    const price = variantId ? Number(variantPrice) : Number(basePrice);

    return {
        productId: product?.id ?? "",
        productName: product?.name ?? "",
        productImage: mainImage,
        variantId: variantId ?? undefined,
        quantity,
        price: Number.isFinite(price) ? price : 0,
        // Store snapshot — display-only; the backend re-derives the real split.
        vendorId: product?.vendor?.id ?? product?.vendorId,
        vendorSlug: product?.vendor?.slug,
        storeName: product?.vendor?.storeName,
        vendorShippingFee:
            product?.vendor?.shippingFee !== undefined
                ? Number(product.vendor.shippingFee)
                : undefined,
        vendorFreeShippingThreshold:
            product?.vendor?.freeShippingThreshold !== undefined
                ? Number(product.vendor.freeShippingThreshold)
                : undefined,
    };
}
