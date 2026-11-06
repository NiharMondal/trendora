"use client";

import { ArrowLeft, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { currencyFormatter } from "@/features/cart/utils/calculate-order-total";
import {
    orderStatusMap,
    paymentStatusMap,
    refundStatusMap,
} from "@/features/orders/constants/status-maps";
import { useVendorOrderByIdQuery } from "@/features/vendors/api/vendor-order.api";
import VendorOrderStatusModal, {
    STATUS_ACTION_LABELS,
    VENDOR_TRANSITIONS,
} from "@/features/vendors/components/vendor-order-status-modal";
import SpinnerLoading from "@/shared/components/loading/spinner-loading";
import QueryError from "@/shared/components/query-error";
import RowText from "@/shared/components/row-text";
import { formatDate } from "@/shared/lib/format-date-time";
import type { TOrderStatus, TPaymentStatus } from "@/shared/types/status.types";
import { Button } from "@/shared/ui/button";
import { StatusBadge } from "@/shared/ui/status-badge";

/** The address fields the order snapshotted at checkout. */
const ADDRESS_FIELDS = [
    "street",
    "city",
    "state",
    "postalCode",
    "country",
] as const;

const money = (value?: string | null) => currencyFormatter(Number(value ?? 0));

/**
 * One parcel from the seller's side — the screen behind a row of
 * `/vendor/orders`.
 *
 * It shows only this store's slice: the buyer may have bought from other stores
 * in the same checkout, and the backend never returns those items here. The
 * money block ends in what the store earns, because the parcel total includes
 * tax the platform remits and commission it keeps.
 */
export default function VendorOrderDetails({ id }: { id: string }) {
    const { data, isLoading, error, refetch } = useVendorOrderByIdQuery(id);
    const [nextStatus, setNextStatus] = useState<TOrderStatus | null>(null);

    if (isLoading) return <SpinnerLoading />;
    if (error) {
        return (
            <QueryError
                error={error}
                onRetry={refetch}
                title="Could not load this parcel"
                notFound={{
                    title: "Parcel not found",
                    description:
                        "It may belong to another store, or the link is wrong.",
                }}
            />
        );
    }

    const parcel = data?.result;
    if (!parcel) return null;

    const address = (parcel.order?.shippingSnapshot ?? {}) as Record<
        string,
        string | undefined
    >;
    const nexts = VENDOR_TRANSITIONS[parcel.orderStatus] ?? [];
    const commissionPercent = (Number(parcel.commissionRate) * 100).toFixed(1);

    return (
        <div className="space-y-5">
            <Button variant="ghost" size="sm" asChild>
                <Link href="/vendor/orders">
                    <ArrowLeft className="size-4" />
                    Back to orders
                </Link>
            </Button>

            {/* Header + the moves the backend will accept from a seller */}
            <div className="bg-white rounded-md p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-3">
                        <h3>{parcel.vendorOrderNumber}</h3>
                        <StatusBadge
                            statusMap={orderStatusMap}
                            status={parcel.orderStatus}
                        />
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Order {parcel.order?.orderNumber} · placed{" "}
                        {formatDate(parcel.createdAt, "MMM Do, YYYY HH:mm A")}
                    </p>
                </div>
                {nexts.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {nexts.map((next) => (
                            <Button
                                key={next}
                                variant={
                                    next === "CANCELED"
                                        ? "destructive"
                                        : "default"
                                }
                                onClick={() => setNextStatus(next)}
                            >
                                {STATUS_ACTION_LABELS[next]}
                            </Button>
                        ))}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Items */}
                <div className="bg-white rounded-md p-5 space-y-4 lg:col-span-2">
                    <h5 className="font-semibold">
                        Items ({parcel.items?.length ?? 0})
                    </h5>
                    <ul className="divide-y">
                        {parcel.items?.map((item) => {
                            const image = item.product?.images?.[0]?.url;
                            return (
                                <li
                                    key={item.id}
                                    className="flex items-center gap-4 py-3"
                                >
                                    <div className="relative size-14 shrink-0 overflow-hidden rounded-md bg-muted">
                                        {image ? (
                                            <Image
                                                src={image}
                                                alt=""
                                                fill
                                                sizes="56px"
                                                className="object-cover"
                                            />
                                        ) : (
                                            <Package className="m-auto mt-4 size-5 text-muted-foreground" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium line-clamp-1">
                                            {item.productName}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {item.variantDetails
                                                ? `${item.variantDetails} · `
                                                : ""}
                                            {money(item.priceAtPurchase)} ×{" "}
                                            {item.quantity}
                                        </p>
                                    </div>
                                    <p className="text-sm font-medium">
                                        {money(item.subtotal)}
                                    </p>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* Money */}
                <div className="bg-white rounded-md p-5 space-y-3 text-sm">
                    <h5 className="font-semibold">Parcel money</h5>
                    <RowText title="Subtotal" value={money(parcel.subtotal)} />
                    <RowText
                        title="Shipping"
                        value={money(parcel.shippingCost)}
                    />
                    <RowText title="Tax" value={money(parcel.tax)} />
                    <RowText
                        title="Buyer paid"
                        value={money(parcel.totalAmount)}
                        className="font-medium border-t pt-3"
                    />
                    <RowText
                        title={`Commission (${commissionPercent}%)`}
                        value={`− ${money(parcel.commissionAmount)}`}
                        className="text-muted-foreground"
                    />
                    <RowText
                        title="Tax (remitted by Trendora)"
                        value={`− ${money(parcel.tax)}`}
                        className="text-muted-foreground"
                    />
                    <RowText
                        title="You earn"
                        value={money(parcel.vendorEarning)}
                        className="font-semibold text-success-600 border-t pt-3"
                    />
                    <p className="text-xs text-muted-foreground">
                        {parcel.payoutId ? (
                            <>
                                Settled in{" "}
                                <Link
                                    href={`/vendor/payouts/${parcel.payoutId}`}
                                    className="underline"
                                >
                                    this payout
                                </Link>
                                .
                            </>
                        ) : parcel.orderStatus === "DELIVERED" ? (
                            "Delivered — included in your next payout once the buyer's payment has cleared."
                        ) : (
                            "Becomes payable once the parcel is delivered."
                        )}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Ship to */}
                <div className="bg-white rounded-md p-5 space-y-2 text-sm">
                    <h5 className="font-semibold">Ship to</h5>
                    <p className="font-medium">
                        {address.fullName ?? parcel.order?.user?.name ?? "—"}
                    </p>
                    {(address.phone ?? parcel.order?.user?.phone) && (
                        <p>{address.phone ?? parcel.order?.user?.phone}</p>
                    )}
                    <p className="text-muted-foreground">
                        {ADDRESS_FIELDS.map((field) => address[field])
                            .filter(Boolean)
                            .join(", ") || "No address on file"}
                    </p>
                    {parcel.order?.notes && (
                        <p className="rounded-md bg-muted p-3 text-xs">
                            <span className="font-medium">Buyer note: </span>
                            {parcel.order.notes}
                        </p>
                    )}
                </div>

                {/* Payment + refund */}
                <div className="bg-white rounded-md p-5 space-y-3 text-sm">
                    <h5 className="font-semibold">Payment</h5>
                    <div className="flex items-center justify-between">
                        <span>
                            {parcel.order?.paymentMethod?.split("_").join(" ")}
                        </span>
                        <StatusBadge
                            statusMap={paymentStatusMap}
                            status={parcel.order?.paymentStatus as TPaymentStatus}
                        />
                    </div>
                    {/* The payment spans every store on the order; what matters
                        for a cancelled parcel is whether ITS money went back. */}
                    {parcel.refund && (
                        <div className="space-y-1 border-t pt-3">
                            <div className="flex items-center justify-between">
                                <span>
                                    Refund {money(parcel.refund.amount)}
                                </span>
                                <StatusBadge
                                    statusMap={refundStatusMap}
                                    status={parcel.refund.status}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {parcel.refund.status === "SUCCEEDED"
                                    ? `Returned to the buyer ${formatDate(parcel.refund.processedAt ?? "", "ll")}.`
                                    : "Trendora handles the refund; nothing is needed from you."}
                            </p>
                        </div>
                    )}
                </div>

                {/* Shipment */}
                <div className="bg-white rounded-md p-5 space-y-2 text-sm">
                    <h5 className="font-semibold">Shipment</h5>
                    <RowText title="Carrier" value={parcel.carrier ?? "—"} />
                    <RowText
                        title="Tracking"
                        value={parcel.trackingNumber ?? "—"}
                    />
                    <RowText
                        title="Shipped"
                        value={
                            parcel.shippedAt
                                ? formatDate(parcel.shippedAt, "ll")
                                : "—"
                        }
                    />
                    <RowText
                        title="Delivered"
                        value={
                            parcel.deliveredAt
                                ? formatDate(parcel.deliveredAt, "ll")
                                : "—"
                        }
                    />
                    {parcel.canceledAt && (
                        <p className="text-xs text-red-600">
                            Cancelled {formatDate(parcel.canceledAt, "ll")}
                            {parcel.cancelReason
                                ? ` — ${parcel.cancelReason}`
                                : ""}
                        </p>
                    )}
                </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-md p-5 space-y-4">
                <h5 className="font-semibold">History</h5>
                {parcel.statusHistory?.length ? (
                    <ol className="space-y-3 border-l pl-4">
                        {parcel.statusHistory.map((entry) => (
                            <li key={entry.id} className="space-y-1 text-sm">
                                <div className="flex flex-wrap items-center gap-2">
                                    <StatusBadge
                                        statusMap={orderStatusMap}
                                        status={entry.newStatus}
                                    />
                                    <span className="text-xs text-muted-foreground">
                                        {formatDate(entry.createdAt, "MMM Do, YYYY HH:mm A")}
                                    </span>
                                </div>
                                {entry.note && (
                                    <p className="text-xs text-muted-foreground">
                                        {entry.note}
                                    </p>
                                )}
                            </li>
                        ))}
                    </ol>
                ) : (
                    <p className="text-sm text-muted-foreground">
                        No status changes yet.
                    </p>
                )}
            </div>

            {nextStatus && (
                <VendorOrderStatusModal
                    key={`${parcel.id}-${nextStatus}`}
                    vendorOrder={parcel}
                    nextStatus={nextStatus}
                    open={!!nextStatus}
                    onOpenChange={(open) => !open && setNextStatus(null)}
                />
            )}
        </div>
    );
}
