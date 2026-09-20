export type TOrderStatus =
    | "PENDING"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELED";

export type TPaymentStatus =
    | "PENDING"
    | "PAID"
    | "FAILED"
    /** Some parcels of a multi-vendor order refunded, others not. */
    | "PARTIALLY_REFUNDED"
    | "REFUNDED";

export type TUserStatus =
    | "ACTIVE"
    | "INACTIVE";

export type TProductStatus =
    | "ACTIVE"
    | "INACTIVE"
    | "OUT_OF_STOCK"

/** Admin moderation state of a listing (backend `ProductStatus`). */
export type TProductModerationStatus =
    | "DRAFT"
    | "PENDING"
    | "APPROVED"
    | "REJECTED";

/** Store standing (backend `VendorStatus`). */
export type TVendorStatus =
    | "PENDING"
    | "APPROVED"
    | "REJECTED"
    | "SUSPENDED";

/** Settlement state of a payout batch (backend `PayoutStatus`). */
export type TPayoutStatus =
    | "PENDING"
    | "PROCESSING"
    | "PAID"
    | "FAILED";

export type TCouponStatus =
    | "ACTIVE"
    | "EXPIRED"
    | "INACTIVE";

/** State of one attempt to move money back to a buyer (backend `RefundStatus`). */
export type TRefundStatus =
    | "PENDING"
    | "PROCESSING"
    | "SUCCEEDED"
    | "FAILED"
    | "CANCELED";
