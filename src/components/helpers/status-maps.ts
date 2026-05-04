import type { TPaymentStatus, TOrderStatus } from "@/components/types/status.types";

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
