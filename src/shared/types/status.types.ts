/**
 * The ONE definition of every status vocabulary the backend sends. Each union
 * mirrors a Prisma enum in `backend/prisma/schema.prisma` (and its Zod mirror
 * in `backend/src/helpers/enum.ts`) — the three must agree.
 *
 * Lives in `shared/` because it is cross-feature and imports nothing: orders,
 * vendors, payouts, refunds and analytics all read it. Feature type files may
 * re-export from here, but must never declare their own copy — that is how
 * `PaymentStatus` came to exist three times with one copy missing
 * `PARTIALLY_REFUNDED` (FE-28 / XR-09).
 *
 * Deleted as phantoms (no backend counterpart): `TUserStatus` (a `User` has
 * only `isDeleted`), `TCouponStatus` (no `Coupon` model), and the
 * pre-marketplace `TProductStatus` — use `TProductModerationStatus`.
 */
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

/** State of one attempt to move money back to a buyer (backend `RefundStatus`). */
export type TRefundStatus =
    | "PENDING"
    | "PROCESSING"
    | "SUCCEEDED"
    | "FAILED"
    | "CANCELED";
