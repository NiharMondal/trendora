import { TRefundStatus } from "@/features/refunds/types/refund.types";

/**
 * Refund status in the BUYER's words. `refundStatusMap` (orders/constants) is
 * the operator's view — "Owed", "Abandoned" — which reads as alarming or
 * meaningless to the person waiting for their money.
 *
 * `status` is about the money, not the parcel: a CANCELED parcel whose refund
 * is FAILED is a buyer who has not been paid, so FAILED must never read as
 * settled.
 */
export const buyerRefundStatusMap: Record<
    TRefundStatus,
    { label: string; className: string }
> = {
    PENDING: {
        label: "Processing",
        className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200",
    },
    PROCESSING: {
        label: "On its way",
        className: "bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200",
    },
    SUCCEEDED: {
        label: "Refunded",
        className: "bg-green-100 text-green-800 hover:bg-green-100 border-green-200",
    },
    FAILED: {
        label: "Delayed",
        className: "bg-red-100 text-red-800 hover:bg-red-100 border-red-200",
    },
    CANCELED: {
        label: "Not refunded",
        className: "bg-gray-100 text-gray-600 hover:bg-gray-100 border-gray-200",
    },
};

/** One line under the badge: what the status means for the buyer. */
export const buyerRefundStatusHint: Record<TRefundStatus, string> = {
    PENDING: "We have started your refund.",
    PROCESSING: "Sent to your bank. Card refunds usually appear within 5–10 business days.",
    SUCCEEDED: "The money has been returned.",
    FAILED: "Sending it failed. Our team can see this and will resolve it — you do not need to do anything.",
    CANCELED: "This refund was withdrawn. Contact support if you did not expect this.",
};
