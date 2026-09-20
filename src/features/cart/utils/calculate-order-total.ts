import { TCartItem, TCartTotals, TCartVendorGroup } from "@/features/cart/types/cart.types";
import { envConfig } from "@/shared/config/env-config";

/**
 * Checkout math — the display-only twin of `validateAndCalculateOrder` in
 * `backend/src/helpers/order.ts`. Keep the two in sync; the backend recomputes
 * everything from DB prices and never trusts what the client sends.
 *
 * Shipping is charged PER STORE. A cart holding items from two stores pays two
 * shipping fees, each judged against that store's own free-shipping threshold:
 *
 *   per store:  subtotal = sum(price x qty)
 *               shipping = subtotal >= store.freeShippingThreshold ? 0 : store.shippingFee
 *               tax      = round2(subtotal x TAX_RATE)
 *   cart total = sum over stores of (subtotal + tax + shipping)
 *
 * The env fallbacks below are only for cart lines added before stores existed
 * (a persisted cart in localStorage from the pre-marketplace build) and for a
 * product payload that somehow arrived without its vendor. Real values come
 * from the store on each item.
 */

const round2 = (value: number) =>
    Math.round((value + Number.EPSILON) * 100) / 100;

const TAX_RATE = Number(envConfig.tax_rate) || 0;
/** Legacy/global fallbacks — see the note above. */
const FALLBACK_SHIPPING_FEE = Number(envConfig.shipping_cost) || 0;
const FALLBACK_FREE_SHIPPING_THRESHOLD =
    Number(envConfig.free_shipping_threshold) || 0;

/** Groups cart lines by their owning store, preserving insertion order. */
export function groupCartByVendor(items: TCartItem[]): TCartVendorGroup[] {
    const groups = new Map<string, TCartItem[]>();

    for (const item of items) {
        // A cart line with no vendor (persisted from an older build) is
        // bucketed on its own rather than silently merged into another store.
        const key = item.vendorId ?? `__unknown:${item.productId}`;
        const bucket = groups.get(key) ?? [];
        bucket.push(item);
        groups.set(key, bucket);
    }

    return [...groups.entries()].map(([vendorId, vendorItems]) => {
        const first = vendorItems[0];

        const subtotal = round2(
            vendorItems.reduce(
                (total, item) => total + item.price * item.quantity,
                0,
            ),
        );

        const shippingFee =
            first.vendorShippingFee ?? FALLBACK_SHIPPING_FEE;
        const freeShippingThreshold =
            first.vendorFreeShippingThreshold ??
            FALLBACK_FREE_SHIPPING_THRESHOLD;

        const qualifiesForFreeShipping =
            freeShippingThreshold > 0 && subtotal >= freeShippingThreshold;

        const shippingCost = qualifiesForFreeShipping
            ? 0
            : round2(shippingFee);

        const tax = round2(subtotal * TAX_RATE);

        return {
            vendorId,
            vendorSlug: first.vendorSlug,
            storeName: first.storeName ?? "Trendora",
            items: vendorItems,
            subtotal,
            tax,
            shippingCost,
            totalAmount: round2(subtotal + tax + shippingCost),
            freeShippingThreshold,
            qualifiesForFreeShipping,
            freeShippingGap: qualifiesForFreeShipping
                ? 0
                : round2(Math.max(freeShippingThreshold - subtotal, 0)),
        };
    });
}

export function calculateOrderTotals(items: TCartItem[]): TCartTotals {
    const vendors = groupCartByVendor(items);

    const sum = (pick: (group: TCartVendorGroup) => number) =>
        round2(vendors.reduce((total, group) => total + pick(group), 0));

    return {
        vendors,
        subtotal: sum((g) => g.subtotal),
        tax: sum((g) => g.tax),
        shippingCost: sum((g) => g.shippingCost),
        totalAmount: sum((g) => g.totalAmount),
    };
}

export const currencyFormatter = (n: number) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
    }).format(n);
