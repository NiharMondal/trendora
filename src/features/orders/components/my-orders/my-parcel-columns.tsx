import { DataTableColumn } from "@/shared/components/table/table-types";
import {
    orderStatusMap,
    refundStatusMap,
} from "@/features/orders/constants/status-maps";
import { TVendorOrder } from "@/features/vendors/types/vendor-order.types";
import { StatusBadge } from "@/shared/ui/status-badge";

import VendorOrderReviewButton from "./vendor-order-review-button";

/**
 * Expanded sub-rows of the buyer's order list — one per store parcel, since
 * each ships, tracks and is refunded on its own.
 */
export const myParcelColumns = (): DataTableColumn<TVendorOrder>[] => {
    return [
        {
            key: "storeName",
            header: "Store",
            cell: (slice) => (
                <span className="font-medium">
                    {slice.vendor?.storeName ?? "—"}
                </span>
            ),
        },
        {
            key: "items",
            header: "Items",
            cell: (slice) => (
                <div className="space-y-0.5">
                    {slice.items?.map((item) => (
                        <p key={item.id} className="text-xs">
                            {item.productName}
                            {item.variantDetails
                                ? ` (${item.variantDetails})`
                                : ""}{" "}
                            × {item.quantity}
                        </p>
                    ))}
                </div>
            ),
        },
        {
            key: "orderStatus",
            header: "Status",
            cell: (slice) => (
                <div className="space-y-1">
                    <StatusBadge
                        statusMap={orderStatusMap}
                        status={slice.orderStatus}
                    />
                    {/* A cancelled parcel is refunded
                        automatically — show the buyer where
                        their money is rather than leaving
                        "cancelled" to mean nothing. */}
                    {slice.refund && (
                        <div className="flex items-center gap-1">
                            <span className="text-[10px] text-muted-foreground">
                                Refund
                            </span>
                            <StatusBadge
                                statusMap={refundStatusMap}
                                status={slice.refund.status}
                                className="text-[10px] px-1.5 py-0"
                            />
                        </div>
                    )}
                </div>
            ),
        },
        {
            key: "trackingNumber",
            header: "Tracking",
            cell: (slice) =>
                slice.trackingNumber ? (
                    <span className="text-xs">
                        {slice.carrier
                            ? `${slice.carrier}: `
                            : ""}
                        {slice.trackingNumber}
                    </span>
                ) : (
                    <span className="text-xs text-muted-foreground">
                        —
                    </span>
                ),
        },
        {
            key: "totalAmount",
            header: "Parcel total",
            cell: (slice) => <span>${slice.totalAmount}</span>,
        },
        {
            key: "review",
            header: "",
            cell: (slice) => (
                <VendorOrderReviewButton vendorOrder={slice} />
            ),
        },
    ];
};
