"use client";

import { ArrowLeft, Check, Package, Store } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { currencyFormatter } from "@/features/cart/utils/calculate-order-total";
import { useOrderByIdQuery } from "@/features/orders/api/order.api";
import {
    orderStatusMap,
    paymentStatusMap,
    refundStatusMap,
} from "@/features/orders/constants/status-maps";
import type { ShippingSnapshot } from "@/features/orders/types/order.types";
import { TVendorOrder } from "@/features/vendors/types/vendor-order.types";
import SpinnerLoading from "@/shared/components/loading/spinner-loading";
import QueryError from "@/shared/components/query-error";
import RowText from "@/shared/components/row-text";
import { formatDate } from "@/shared/lib/format-date-time";
import { cn } from "@/shared/lib/utils";
import type { TOrderStatus } from "@/shared/types/status.types";
import { Button } from "@/shared/ui/button";
import { StatusBadge } from "@/shared/ui/status-badge";

import CancelParcelModal from "./cancel-parcel-modal";
import VendorOrderReviewButton from "./vendor-order-review-button";

/** The address fields the order snapshotted at checkout. */
const ADDRESS_FIELDS = [
    "street",
    "city",
    "state",
    "postalCode",
    "country",
] as const;

/** The happy path a parcel walks; CANCELED leaves it. */
const PARCEL_STEPS: { status: TOrderStatus; label: string }[] = [
    { status: "PENDING", label: "Placed" },
    { status: "PROCESSING", label: "Processing" },
    { status: "SHIPPED", label: "Shipped" },
    { status: "DELIVERED", label: "Delivered" },
];

const money = (value?: string | null) => currencyFormatter(Number(value ?? 0));

/**
 * One order from the buyer's side — the screen behind a row of
 * `/dashboard/my-orders`.
 *
 * Laid out per PARCEL, not per order: each store ships, tracks, cancels and
 * refunds on its own, and `order.orderStatus` is only a rollup of those. The
 * sidebar carries what is genuinely order-level — the money, the one payment
 * and the one delivery address.
 */
export default function MyOrderDetails({ id }: { id: string }) {
    const { data, isLoading, error, refetch } = useOrderByIdQuery(id);

    if (isLoading) return <SpinnerLoading />;
    if (error) {
        return (
            <QueryError
                error={error}
                onRetry={refetch}
                title="Could not load this order"
                notFound={{
                    title: "Order not found",
                    description:
                        "It may belong to another account, or the link is wrong.",
                }}
            />
        );
    }

    const order = data?.result;
    if (!order) return null;

    const parcels = order.vendorOrders ?? [];
    // The snapshot can be missing on a very old order, so every field may be.
    const address: Partial<ShippingSnapshot> = order.shippingSnapshot ?? {};

    return (
        <div className="space-y-5">
            <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/my-orders">
                    <ArrowLeft className="size-4" />
                    Back to my orders
                </Link>
            </Button>

            {/* Header */}
            <div className="bg-white rounded-md p-5 space-y-1">
                <div className="flex flex-wrap items-center gap-3">
                    <h3>Order #{order.orderNumber}</h3>
                    <StatusBadge
                        statusMap={orderStatusMap}
                        status={order.orderStatus}
                    />
                </div>
                <p className="text-sm text-muted-foreground">
                    Placed {formatDate(order.createdAt, "MMM Do, YYYY HH:mm A")}{" "}
                    · {parcels.length}{" "}
                    {parcels.length === 1 ? "parcel" : "parcels"}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
                {/* Parcels */}
                <div className="space-y-5 lg:col-span-2">
                    {parcels.length > 0 ? (
                        parcels.map((parcel) => (
                            <ParcelCard key={parcel.id} parcel={parcel} />
                        ))
                    ) : (
                        <div className="bg-white rounded-md p-5 text-sm text-muted-foreground">
                            No store parcels on this order yet.
                        </div>
                    )}
                </div>

                {/* Order-level sidebar */}
                <div className="space-y-5">
                    <div className="bg-white rounded-md p-5 space-y-3 text-sm">
                        <h5 className="font-semibold">Order summary</h5>
                        <RowText
                            title="Subtotal"
                            value={money(order.subtotal)}
                        />
                        {/* One fee per store, each judged against that
                            store's own free-shipping threshold. */}
                        <RowText
                            title={`Shipping (${parcels.length} ${parcels.length === 1 ? "store" : "stores"})`}
                            value={money(order.shippingCost)}
                        />
                        <RowText title="Tax" value={money(order.tax)} />
                        {Number(order.discount) > 0 && (
                            <RowText
                                title="Discount"
                                value={`− ${money(order.discount)}`}
                                className="text-success-600"
                            />
                        )}
                        <RowText
                            title="Total"
                            value={money(order.totalAmount)}
                            className="font-semibold border-t pt-3"
                        />
                        {order.payment?.refundAmount &&
                            Number(order.payment.refundAmount) > 0 && (
                                <RowText
                                    title="Refunded"
                                    value={`− ${money(order.payment.refundAmount)}`}
                                    className="text-muted-foreground"
                                />
                            )}
                    </div>

                    <div className="bg-white rounded-md p-5 space-y-3 text-sm">
                        <h5 className="font-semibold">Payment</h5>
                        <div className="flex items-center justify-between">
                            <span>
                                {order.paymentMethod?.split("_").join(" ")}
                            </span>
                            <StatusBadge
                                statusMap={paymentStatusMap}
                                status={order.paymentStatus}
                            />
                        </div>
                        {order.payment?.paidAt && (
                            <p className="text-xs text-muted-foreground">
                                Paid {formatDate(order.payment.paidAt, "ll")}
                            </p>
                        )}
                    </div>

                    <div className="bg-white rounded-md p-5 space-y-2 text-sm">
                        <h5 className="font-semibold">Delivery address</h5>
                        <p className="font-medium">
                            {address.fullName ?? order.user?.name ?? "—"}
                        </p>
                        {address.phone && <p>{address.phone}</p>}
                        <p className="text-muted-foreground">
                            {ADDRESS_FIELDS.map((field) => address[field])
                                .filter(Boolean)
                                .join(", ") || "No address on file"}
                        </p>
                        {order.notes && (
                            <p className="rounded-md bg-muted p-3 text-xs">
                                <span className="font-medium">Your note: </span>
                                {order.notes}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

/** One store's parcel: progress, items, shipment, money and actions. */
function ParcelCard({ parcel }: { parcel: TVendorOrder }) {
    const isCanceled = parcel.orderStatus === "CANCELED";
    const stepIndex = PARCEL_STEPS.findIndex(
        (step) => step.status === parcel.orderStatus,
    );

    return (
        <div className="bg-white rounded-md p-5 space-y-5">
            {/* Store + status + actions */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <Store className="size-4 text-muted-foreground" />
                        {parcel.vendor?.slug ? (
                            <Link
                                href={`/stores/${parcel.vendor.slug}`}
                                className="font-semibold hover:underline"
                            >
                                {parcel.vendor.storeName}
                            </Link>
                        ) : (
                            <span className="font-semibold">
                                {parcel.vendor?.storeName ?? "Store"}
                            </span>
                        )}
                        <StatusBadge
                            statusMap={orderStatusMap}
                            status={parcel.orderStatus}
                        />
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Parcel #{parcel.vendorOrderNumber}
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <CancelParcelModal vendorOrder={parcel} />
                    <VendorOrderReviewButton vendorOrder={parcel} />
                </div>
            </div>

            {/* Progress */}
            {isCanceled ? (
                <div className="rounded-md bg-red-50 p-3 text-sm space-y-2">
                    <p className="text-red-700">
                        Cancelled
                        {parcel.canceledAt
                            ? ` ${formatDate(parcel.canceledAt, "ll")}`
                            : ""}
                        {parcel.cancelReason
                            ? ` — ${parcel.cancelReason}`
                            : ""}
                    </p>
                    {/* Show where the money is, rather than leaving
                        "cancelled" to mean nothing. */}
                    {parcel.refund && (
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                            <span>Refund {money(parcel.refund.amount)}</span>
                            <StatusBadge
                                statusMap={refundStatusMap}
                                status={parcel.refund.status}
                            />
                            {parcel.refund.status === "SUCCEEDED" &&
                                parcel.refund.processedAt && (
                                    <span className="text-muted-foreground">
                                        returned{" "}
                                        {formatDate(
                                            parcel.refund.processedAt,
                                            "ll",
                                        )}
                                    </span>
                                )}
                        </div>
                    )}
                </div>
            ) : (
                <ol className="grid grid-cols-4 gap-2">
                    {PARCEL_STEPS.map((step, index) => {
                        const done = index <= stepIndex;
                        return (
                            <li key={step.status} className="space-y-1.5">
                                <div
                                    className={cn(
                                        "h-1.5 rounded-full bg-muted",
                                        done && "bg-primary",
                                    )}
                                />
                                <p
                                    className={cn(
                                        "flex items-center gap-1 text-xs text-muted-foreground",
                                        done && "text-foreground font-medium",
                                    )}
                                >
                                    {done && <Check className="size-3" />}
                                    {step.label}
                                </p>
                            </li>
                        );
                    })}
                </ol>
            )}

            {/* Items */}
            <ul className="divide-y border-y">
                {parcel.items?.map((item) => {
                    const image = item.product?.images?.[0]?.url;
                    const name = (
                        <p className="text-sm font-medium line-clamp-1">
                            {item.productName}
                        </p>
                    );
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
                                {item.product?.slug ? (
                                    <Link
                                        href={`/products/${item.product.slug}`}
                                        className="hover:underline"
                                    >
                                        {name}
                                    </Link>
                                ) : (
                                    name
                                )}
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

            {/* Shipment + parcel money */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
                <div className="space-y-2">
                    <h6 className="font-semibold">Shipment</h6>
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
                </div>
                <div className="space-y-2">
                    <h6 className="font-semibold">Parcel total</h6>
                    <RowText title="Items" value={money(parcel.subtotal)} />
                    <RowText
                        title="Shipping"
                        value={
                            Number(parcel.shippingCost) === 0
                                ? "Free"
                                : money(parcel.shippingCost)
                        }
                    />
                    <RowText title="Tax" value={money(parcel.tax)} />
                    <RowText
                        title="Total"
                        value={money(parcel.totalAmount)}
                        className="font-medium border-t pt-2"
                    />
                </div>
            </div>

            {/* History — collapsed; the progress bar covers the common case. */}
            {parcel.statusHistory && parcel.statusHistory.length > 0 && (
                <details className="group text-sm">
                    <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                        Status history ({parcel.statusHistory.length})
                    </summary>
                    <ol className="mt-3 space-y-3 border-l pl-4">
                        {parcel.statusHistory.map((entry) => (
                            <li key={entry.id} className="space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <StatusBadge
                                        statusMap={orderStatusMap}
                                        status={entry.newStatus}
                                    />
                                    <span className="text-xs text-muted-foreground">
                                        {formatDate(
                                            entry.createdAt,
                                            "MMM Do, YYYY HH:mm A",
                                        )}
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
                </details>
            )}
        </div>
    );
}
