import { TRefundStatus } from "@/features/refunds/types/refund.types";
import type { TStatusMap } from "@/shared/ui/status-badge";

/**
 * Refund status in the BUYER's words. `refundStatusMap` (orders/constants) is
 * the operator's view — "Owed", "Abandoned" — which reads as alarming or
 * meaningless to the person waiting for their money.
 *
 * `status` is about the money, not the parcel: a CANCELED parcel whose refund
 * is FAILED is a buyer who has not been paid, so FAILED must never read as
 * settled.
 */
export const buyerRefundStatusMap: TStatusMap<TRefundStatus> = {
    PENDING: { label: "Processing" },
    PROCESSING: { label: "On its way" },
    SUCCEEDED: { label: "Refunded" },
    FAILED: { label: "Delayed" },
    CANCELED: { label: "Not refunded" },
};

/** One line under the badge: what the status means for the buyer. */
export const buyerRefundStatusHint: Record<TRefundStatus, string> = {
    PENDING: "We have started your refund.",
    PROCESSING: "Sent to your bank. Card refunds usually appear within 5–10 business days.",
    SUCCEEDED: "The money has been returned.",
    FAILED: "Sending it failed. Our team can see this and will resolve it — you do not need to do anything.",
    CANCELED: "This refund was withdrawn. Contact support if you did not expect this.",
};
