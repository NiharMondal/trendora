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

export type TCouponStatus =
    | "ACTIVE"
    | "EXPIRED"
    | "INACTIVE";
