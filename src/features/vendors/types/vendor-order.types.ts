import { TVendorCard } from "@/features/vendors/types/vendor.types";
import { TOrderStatus } from "@/features/orders/types/status.types";

/**
 * One vendor's slice of an order — the unit of fulfilment and payout.
 *
 * This is what a vendor sees in their queue, and what nests inside `TOrder`
 * for a buyer. `orderStatus` here is authoritative; the parent
 * `Order.orderStatus` is only a rollup.
 */
export type TVendorOrderItem = {
    id: string;
    orderId: string;
    vendorOrderId: string;
    vendorId: string;
    productId: string;
    productName: string;
    variantId?: string | null;
    variantDetails?: string | null;
    quantity: number;
    priceAtPurchase: string;
    originalPrice: string;
    discount: string;
    subtotal: string;
    product?: {
        id?: string;
        name: string;
        slug: string;
        images: { url: string }[];
    };
};

export type TVendorOrderStatusHistory = {
    id: string;
    orderId: string;
    vendorOrderId?: string | null;
    oldStatus: TOrderStatus;
    newStatus: TOrderStatus;
    note?: string | null;
    createdAt: string;
};

export type TVendorOrder = {
    id: string;
    orderId: string;
    vendorId: string;
    vendorOrderNumber: string;
    subtotal: string;
    tax: string;
    shippingCost: string;
    discount: string;
    totalAmount: string;
    /** Snapshot of the store's rate at purchase time. */
    commissionRate: string;
    commissionAmount: string;
    /** What the platform owes this store for this slice. */
    vendorEarning: string;
    orderStatus: TOrderStatus;
    trackingNumber?: string | null;
    carrier?: string | null;
    cancelReason?: string | null;
    shippedAt?: string | null;
    deliveredAt?: string | null;
    canceledAt?: string | null;
    payoutId?: string | null;
    createdAt: string;
    updatedAt: string;
    vendor?: TVendorCard;
    items?: TVendorOrderItem[];
    statusHistory?: TVendorOrderStatusHistory[];
    /** Present on the vendor's own queue — the parent order's buyer context. */
    order?: {
        id: string;
        orderNumber: string;
        paymentMethod: string;
        paymentStatus: string;
        notes?: string | null;
        createdAt: string;
        shippingSnapshot?: Record<string, unknown> | null;
        user?: { id: string; name: string; phone?: string | null };
    };
};

export type TUpdateVendorOrderStatusPayload = {
    orderStatus: TOrderStatus;
    trackingNumber?: string;
    carrier?: string;
    cancelReason?: string;
};
