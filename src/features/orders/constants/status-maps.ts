import type {
    TPaymentStatus,
    TOrderStatus,
    TProductModerationStatus,
    TVendorStatus,
    TPayoutStatus,
    TRefundStatus,
} from "@/features/orders/types/status.types";

type BadgeConfig = {
    label: string;
    className: string; // Tailwind classes for color override
};

type StatusMap<T extends string> = Record<T, BadgeConfig>;

export const paymentStatusMap: StatusMap<TPaymentStatus> = {
    PENDING: {
        label: "Pending",
        className:
            "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200",
    },
    PAID: {
        label: "Paid",
        className:
            "bg-green-100 text-green-800 hover:bg-green-100 border-green-200",
    },
    FAILED: {
        label: "Failed",
        className: "bg-red-100 text-red-800 hover:bg-red-100 border-red-200",
    },
    PARTIALLY_REFUNDED: {
        label: "Part refunded",
        className:
            "bg-indigo-100 text-indigo-800 hover:bg-indigo-100 border-indigo-200",
    },
    REFUNDED: {
        label: "Refunded",
        className:
            "bg-purple-100 text-purple-800 hover:bg-purple-100 border-purple-200",
    },
};

export const orderStatusMap: StatusMap<TOrderStatus> = {
    PENDING: {
        label: "Pending",
        className:
            "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200",
    },
    PROCESSING: {
        label: "Processing",
        className:
            "bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200",
    },
    SHIPPED: {
        label: "Shipped",
        className: "bg-sky-100 text-sky-800 hover:bg-sky-100 border-sky-200",
    },
    DELIVERED: {
        label: "Delivered",
        className:
            "bg-green-100 text-green-800 hover:bg-green-100 border-green-200",
    },
    CANCELED: {
        label: "Canceled",
        className:
            "bg-gray-100 text-gray-600 hover:bg-gray-100 border-gray-200",
    },
};

/**
 * Admin moderation state of a listing. DRAFT/PENDING/REJECTED are all
 * "not on the storefront" — the colours separate "the vendor has not submitted
 * it" from "we are looking at it" from "we said no".
 */
export const productStatusMap: StatusMap<TProductModerationStatus> = {
    DRAFT: {
        label: "Draft",
        className:
            "bg-gray-100 text-gray-600 hover:bg-gray-100 border-gray-200",
    },
    PENDING: {
        label: "In review",
        className:
            "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200",
    },
    APPROVED: {
        label: "Approved",
        className:
            "bg-green-100 text-green-800 hover:bg-green-100 border-green-200",
    },
    REJECTED: {
        label: "Rejected",
        className: "bg-red-100 text-red-800 hover:bg-red-100 border-red-200",
    },
};

export const vendorStatusMap: StatusMap<TVendorStatus> = {
    PENDING: {
        label: "In review",
        className:
            "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200",
    },
    APPROVED: {
        label: "Approved",
        className:
            "bg-green-100 text-green-800 hover:bg-green-100 border-green-200",
    },
    REJECTED: {
        label: "Rejected",
        className: "bg-red-100 text-red-800 hover:bg-red-100 border-red-200",
    },
    SUSPENDED: {
        label: "Suspended",
        className:
            "bg-orange-100 text-orange-800 hover:bg-orange-100 border-orange-200",
    },
};

export const payoutStatusMap: StatusMap<TPayoutStatus> = {
    PENDING: {
        label: "Pending",
        className:
            "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200",
    },
    PROCESSING: {
        label: "Processing",
        className:
            "bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200",
    },
    PAID: {
        label: "Paid",
        className:
            "bg-green-100 text-green-800 hover:bg-green-100 border-green-200",
    },
    FAILED: {
        label: "Failed",
        className: "bg-red-100 text-red-800 hover:bg-red-100 border-red-200",
    },
};

/**
 * State of the money going back, not of the cancellation. A parcel can be
 * cancelled while its refund is still FAILED — that gap is the thing an
 * operator has to chase, so FAILED is styled as loudly as a payment failure.
 */
export const refundStatusMap: StatusMap<TRefundStatus> = {
    PENDING: {
        label: "Owed",
        className:
            "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200",
    },
    PROCESSING: {
        label: "Sending",
        className:
            "bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200",
    },
    SUCCEEDED: {
        label: "Refunded",
        className:
            "bg-green-100 text-green-800 hover:bg-green-100 border-green-200",
    },
    FAILED: {
        label: "Failed",
        className: "bg-red-100 text-red-800 hover:bg-red-100 border-red-200",
    },
    CANCELED: {
        label: "Abandoned",
        className:
            "bg-gray-100 text-gray-600 hover:bg-gray-100 border-gray-200",
    },
};
