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
