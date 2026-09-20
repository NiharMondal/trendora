export type TPayoutStatus = "PENDING" | "PROCESSING" | "PAID" | "FAILED";

export type TPayout = {
    id: string;
    vendorId: string;
    /** Sum of `vendorEarning` over the attached vendor orders. */
    amount: string;
    status: TPayoutStatus;
    method?: string | null;
    /** Bank/gateway receipt, set when the money actually moved. */
    reference?: string | null;
    failureReason?: string | null;
    periodStart: string;
    periodEnd: string;
    processedAt?: string | null;
    notes?: string | null;
    createdAt: string;
    updatedAt: string;
    vendor?: {
        id: string;
        storeName: string;
        slug: string;
        businessEmail?: string;
    };
    _count?: { vendorOrders?: number };
    vendorOrders?: {
        id: string;
        vendorOrderNumber: string;
        subtotal: string;
        shippingCost: string;
        commissionAmount: string;
        vendorEarning: string;
        deliveredAt?: string | null;
        order?: { orderNumber: string };
    }[];
};

/** `GET /payouts/me/balance`. */
export type TVendorBalance = {
    vendorId: string;
    /** Delivered + paid + not yet attached to a payout. */
    availableForPayout: number;
    availableOrderCount: number;
    commissionWithheld: number;
    /** Paid by the buyer but still being fulfilled, so not settleable yet. */
    pendingFulfilment: number;
    pendingFulfilmentOrderCount: number;
    totalPaidOut: number;
    payoutCount: number;
};

/** `GET /payouts/admin/outstanding` — the settlement work queue. */
export type TOutstandingBalances = {
    totalOwed: number;
    vendors: {
        vendorId: string;
        storeName: string | null;
        slug: string | null;
        businessEmail: string | null;
        vendorStatus: string | null;
        orderCount: number;
        amountOwed: number;
        commissionEarned: number;
    }[];
};

export type TGeneratePayoutPayload = {
    vendorId: string;
    periodStart: string;
    periodEnd: string;
    method?: string;
    notes?: string;
};
