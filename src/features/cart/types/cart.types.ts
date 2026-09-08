/**
 * A line in the cart.
 *
 * The `vendor*` / shipping fields are a snapshot of the owning store taken
 * when the item was added. They exist because shipping is charged **per
 * store**: the cart must be able to group its own lines and evaluate each
 * store's free-shipping threshold without re-fetching every product.
 *
 * They are display-only, like every price on the client — the backend
 * recomputes the whole split from the database at checkout and never trusts
 * these values. A stale snapshot (the vendor changed their shipping fee after
 * the item was added) shows a slightly wrong estimate until the cart is
 * refreshed, which is the same tolerance the old flat-fee estimate had.
 */
export type TCartItem = {
    productId: string;
    variantId?: string;
    productName: string;
    productImage?: string;
    quantity: number;
    price: number;
    // ---- owning store (see note above)
    vendorId?: string;
    vendorSlug?: string;
    storeName?: string;
    /** The store's flat delivery fee. */
    vendorShippingFee?: number;
    /** Spend at or above this with THIS store and its shipping is free. */
    vendorFreeShippingThreshold?: number;
};

/** One store's slice of the cart, as priced for display. */
export type TCartVendorGroup = {
    vendorId: string;
    vendorSlug?: string;
    storeName: string;
    items: TCartItem[];
    subtotal: number;
    tax: number;
    shippingCost: number;
    totalAmount: number;
    /** Free-shipping progress for this store, for the nudge in the summary. */
    freeShippingThreshold: number;
    qualifiesForFreeShipping: boolean;
    /** How much more to spend with this store to earn free shipping. */
    freeShippingGap: number;
};

export type TCartTotals = {
    /** One entry per store in the cart. */
    vendors: TCartVendorGroup[];
    subtotal: number;
    tax: number;
    /** SUM of the per-store shipping fees — not one flat fee. */
    shippingCost: number;
    totalAmount: number;
};
