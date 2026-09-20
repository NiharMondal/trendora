export type TRefundStatus =
    | "PENDING"
    | "PROCESSING"
    | "SUCCEEDED"
    | "FAILED"
    | "CANCELED";

/**
 * One attempt to move money back to a buyer — the mirror of a Payout.
 *
 * `status` is the state of the *money*, not of the cancellation: a parcel can
 * be cancelled while its refund is still FAILED, which is exactly the case an
 * operator has to chase.
 */
export type TRefund = {
    id: string;
    orderId: string;
    paymentId: string;
    /** The parcel refunded. Null for an order-level manual refund. */
    vendorOrderId?: string | null;
    amount: string;
    currency: string;
    status: TRefundStatus;
    reason?: string | null;
    /** "stripe" for a gateway refund; "cash"/"bank_transfer"/… when recorded by hand. */
    gateway?: string | null;
    gatewayRefundId?: string | null;
    attempts: number;
    failureReason?: string | null;
    processedAt?: string | null;
    createdAt: string;
    updatedAt: string;
    order?: {
        id: string;
        orderNumber: string;
        totalAmount?: string;
        paymentMethod?: string;
        paymentStatus?: string;
        user?: { id: string; name: string };
    };
    payment?: {
        id: string;
        amount: string;
        transactionId?: string | null;
        refundAmount?: string | null;
    };
    vendorOrder?: {
        id: string;
        vendorOrderNumber: string;
        totalAmount?: string;
        cancelReason?: string | null;
        vendor?: { id?: string; storeName: string; slug?: string };
    } | null;
};

/** `GET /refunds/admin/outstanding` — money owed to buyers that has not moved. */
export type TOutstandingRefunds = {
    totalOutstanding: number;
    outstandingCount: number;
    byStatus: { status: TRefundStatus; count: number; amount: number }[];
    refunds: TRefund[];
};

export type TManualRefundPayload = {
    orderId: string;
    vendorOrderId?: string;
    amount: number;
    reason: string;
    method?: string;
};

export type TRetryAllResult = {
    attempted: number;
    succeeded: number;
    failed: number;
};
