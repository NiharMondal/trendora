import type {
    TPaymentStatus,
    TOrderStatus,
    TProductModerationStatus,
    TVendorStatus,
    TPayoutStatus,
    TRefundStatus,
} from "@/shared/types/status.types";
import type { TStatusMap as StatusMap } from "@/shared/ui/status-badge";

/**
 * Labels only — the colour comes from the status value, via `getStatusTone`
 * in `shared/components/td-status-badge.tsx`.
 */
export const paymentStatusMap: StatusMap<TPaymentStatus> = {
    PENDING: { label: "Pending" },
    PAID: { label: "Paid" },
    FAILED: { label: "Failed" },
    PARTIALLY_REFUNDED: { label: "Part refunded" },
    REFUNDED: { label: "Refunded" },
};

export const orderStatusMap: StatusMap<TOrderStatus> = {
    PENDING: { label: "Pending" },
    PROCESSING: { label: "Processing" },
    SHIPPED: { label: "Shipped" },
    DELIVERED: { label: "Delivered" },
    CANCELED: { label: "Canceled" },
};

/**
 * Admin moderation state of a listing. DRAFT/PENDING/REJECTED are all
 * "not on the storefront" — the colours separate "the vendor has not submitted
 * it" from "we are looking at it" from "we said no".
 */
export const productStatusMap: StatusMap<TProductModerationStatus> = {
    DRAFT: { label: "Draft" },
    PENDING: { label: "In review" },
    APPROVED: { label: "Approved" },
    REJECTED: { label: "Rejected" },
};

export const vendorStatusMap: StatusMap<TVendorStatus> = {
    PENDING: { label: "In review" },
    APPROVED: { label: "Approved" },
    REJECTED: { label: "Rejected" },
    SUSPENDED: { label: "Suspended" },
};

export const payoutStatusMap: StatusMap<TPayoutStatus> = {
    PENDING: { label: "Pending" },
    PROCESSING: { label: "Processing" },
    PAID: { label: "Paid" },
    FAILED: { label: "Failed" },
};

/**
 * State of the money going back, not of the cancellation. A parcel can be
 * cancelled while its refund is still FAILED — that gap is the thing an
 * operator has to chase, so FAILED is styled as loudly as a payment failure.
 */
export const refundStatusMap: StatusMap<TRefundStatus> = {
    PENDING: { label: "Owed" },
    PROCESSING: { label: "Sending" },
    SUCCEEDED: { label: "Refunded" },
    FAILED: { label: "Failed" },
    CANCELED: { label: "Abandoned" },
};
