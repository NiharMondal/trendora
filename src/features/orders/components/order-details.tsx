"use client";
import RowText from "@/shared/components/row-text";
import TDSeparator from "@/shared/components/td-separator";
import SpinnerLoading from "@/shared/components/loading/spinner-loading";
import { cn } from "@/shared/lib/utils";
import { useOrderByIdQuery } from "@/features/orders/api/order.api";
import {
    orderStatusMap,
    paymentStatusMap,
} from "@/features/orders/constants/status-maps";
import { TVendorOrder } from "@/features/vendors/types/vendor-order.types";
import { StatusBadge } from "@/shared/ui/status-badge";
import { formatDate } from "@/shared/lib/format-date-time";
import Link from "next/link";

/**
 * Admin view of one order.
 *
 * The order is presented as a set of PARCELS — one per store — because that is
 * how it is fulfilled and paid out. The order-level status at the top is only
 * a rollup of the parcels below it, so it is labelled as such; the money split
 * (what each store earns, what the platform keeps) is shown per parcel.
 */
export default function OrderDetails({ slug }: { slug: string }) {
    const { data: orderData, isLoading } = useOrderByIdQuery(slug);
    const order = orderData?.result;
    const shippingSnapshot = order?.shippingSnapshot;

    if (isLoading) return <SpinnerLoading />;

    const vendorOrders = order?.vendorOrders ?? [];

    return (
        <div className="space-y-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white padding border-radius">
                <div className="flex items-center gap-3">
                    <h3>Order Details</h3>
                    <div className="space-y-0.5">
                        <StatusBadge
                            statusMap={orderStatusMap}
                            status={order?.orderStatus}
                        />
                        <p className="text-[10px] text-muted-foreground">
                            rolled up from {vendorOrders.length} parcel
                            {vendorOrders.length === 1 ? "" : "s"}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <StatusBadge
                        statusMap={paymentStatusMap}
                        status={order?.paymentStatus}
                    />
                    <p className="flex items-center gap-x-2">
                        Order ID:
                        <span className="text-sm font-medium">
                            #{order?.orderNumber}
                        </span>
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2 space-y-5">
                    {/* One card per store */}
                    {vendorOrders.map((vendorOrder) => (
                        <VendorOrderCard
                            key={vendorOrder.id}
                            vendorOrder={vendorOrder}
                        />
                    ))}

                    {vendorOrders.length === 0 && (
                        <div className="bg-white padding border-radius text-sm text-muted-foreground">
                            This order has no store parcels.
                        </div>
                    )}

                    <div className="bg-white padding border-radius">
                        <p className="text-xl mb-5">Customer Details</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-5">
                            <div className="text-gray-500">
                                <RowText
                                    title="Name"
                                    value={shippingSnapshot?.fullName}
                                    titleClassName="text-gray-800 font-medium"
                                />
                                <RowText
                                    title="Email"
                                    value={order?.user.email}
                                    titleClassName="text-gray-800 font-medium"
                                />
                                <RowText
                                    title="Phone"
                                    value={shippingSnapshot?.phone}
                                    titleClassName="text-gray-800 font-medium"
                                />
                                <RowText
                                    title="Address"
                                    value={shippingSnapshot?.street}
                                    titleClassName="text-gray-800 font-medium"
                                />
                            </div>
                            <div className="text-gray-500">
                                <RowText
                                    title="City"
                                    value={shippingSnapshot?.city}
                                    titleClassName="text-gray-800 font-medium"
                                />
                                <RowText
                                    title="PostalCode"
                                    value={shippingSnapshot?.postalCode}
                                    titleClassName="text-gray-800 font-medium"
                                />
                                <RowText
                                    title="State"
                                    value={shippingSnapshot?.state}
                                    titleClassName="text-gray-800 font-medium"
                                />
                                <RowText
                                    title="Country"
                                    value={shippingSnapshot?.country}
                                    titleClassName="text-gray-800 font-medium"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Order-level money and payment */}
                <div className="lg:col-span-1 space-y-5">
                    <div className="bg-white padding border-radius space-y-3">
                        <p className="font-medium">Order total</p>
                        <div className="text-gray-500">
                            <RowText
                                title="Subtotal"
                                value={`$${order?.subtotal}`}
                            />
                            <RowText
                                title={`Shipping (${vendorOrders.length} store${vendorOrders.length === 1 ? "" : "s"})`}
                                value={`$${order?.shippingCost}`}
                            />
                            <RowText title="Tax" value={`$${order?.tax}`} />
                        </div>
                        <TDSeparator className="my-1.5" />
                        <RowText
                            title="Total"
                            value={`$${order?.totalAmount}`}
                            className="text-black"
                        />
                    </div>

                    <div className="bg-white padding border-radius space-y-3">
                        <p className="font-medium">Payment</p>
                        <div className="text-gray-500">
                            <RowText
                                title="Method"
                                value={order?.paymentMethod
                                    ?.split("_")
                                    .join(" ")}
                            />
                            <RowText
                                title="Status"
                                value={order?.paymentStatus}
                            />
                            {order?.payment?.transactionId && (
                                <RowText
                                    title="Transaction"
                                    value={order.payment.transactionId}
                                />
                            )}
                            {order?.payment?.refundAmount && (
                                <RowText
                                    title="Refunded"
                                    value={`$${order.payment.refundAmount}`}
                                />
                            )}
                        </div>
                        {order?.payment?.refundAmount && (
                            <p className="text-xs text-muted-foreground">
                                Accrued from cancelled parcels. Bookkeeping
                                only — the transfer back to the buyer is not
                                automated yet.
                            </p>
                        )}
                    </div>

                    {order?.notes && (
                        <div className="bg-white padding border-radius space-y-1">
                            <p className="font-medium">Order note</p>
                            <p className="text-sm text-gray-500">
                                {order.notes}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/** One store's parcel: its items, its fulfilment state, and its money split. */
function VendorOrderCard({ vendorOrder }: { vendorOrder: TVendorOrder }) {
    const items = vendorOrder.items ?? [];

    return (
        <div className="bg-white padding border-radius space-y-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    {vendorOrder.vendor ? (
                        <Link
                            href={`/stores/${vendorOrder.vendor.slug}`}
                            className="font-medium hover:underline"
                        >
                            {vendorOrder.vendor.storeName}
                        </Link>
                    ) : (
                        <p className="font-medium">Store</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                        #{vendorOrder.vendorOrderNumber}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {vendorOrder.trackingNumber && (
                        <span className="text-xs text-muted-foreground">
                            {vendorOrder.carrier
                                ? `${vendorOrder.carrier}: `
                                : ""}
                            {vendorOrder.trackingNumber}
                        </span>
                    )}
                    <StatusBadge
                        statusMap={orderStatusMap}
                        status={vendorOrder.orderStatus}
                    />
                </div>
            </div>

            {vendorOrder.cancelReason && (
                <p className="text-xs text-red-600">
                    Cancelled: {vendorOrder.cancelReason}
                </p>
            )}

            <div className="border border-muted border-radius">
                {items.map((item, index) => {
                    const details = (item.variantDetails || "").split(",");
                    return (
                        <div
                            key={item.id}
                            className={cn(
                                "flex justify-between items-center gap-x-2 padding",
                                { "border-b": index !== items.length - 1 },
                            )}
                        >
                            <div className="flex items-center gap-x-2">
                                {item.product?.images?.[0]?.url && (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={item.product.images[0].url}
                                        alt={item.productName}
                                        className="size-16 border-radius object-cover"
                                    />
                                )}
                                <div>
                                    <p>{item.productName}</p>
                                    <ul className="flex items-center gap-x-1.5 list-none text-xs">
                                        <li className="bg-muted px-1 py-0.5 rounded font-medium">
                                            ${item.priceAtPurchase}
                                        </li>
                                        {item.variantDetails &&
                                            details.map((info, i) => (
                                                <li
                                                    key={i}
                                                    className="bg-muted px-1 py-0.5 rounded"
                                                >
                                                    {info}
                                                </li>
                                            ))}
                                    </ul>
                                </div>
                            </div>
                            <div className="text-right">
                                <p>
                                    $
                                    {Number(item.priceAtPurchase) *
                                        item.quantity}
                                </p>
                                <p className="text-sm">Qty: {item.quantity}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* The money split for this parcel. `vendorEarning` is what the
                platform owes this store; the rest of the parcel total is
                commission plus the tax the platform remits. */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <Figure label="Subtotal" value={`$${vendorOrder.subtotal}`} />
                <Figure
                    label="Shipping"
                    value={`$${vendorOrder.shippingCost}`}
                />
                <Figure
                    label={`Commission (${(Number(vendorOrder.commissionRate) * 100).toFixed(1)}%)`}
                    value={`$${vendorOrder.commissionAmount}`}
                />
                <Figure
                    label="Store earns"
                    value={`$${vendorOrder.vendorEarning}`}
                    highlight
                />
            </div>

            {vendorOrder.deliveredAt && (
                <p className="text-xs text-muted-foreground">
                    Delivered {formatDate(vendorOrder.deliveredAt, "MMM Do, YYYY HH:mm A")}
                </p>
            )}
        </div>
    );
}

function Figure({
    label,
    value,
    highlight,
}: {
    label: string;
    value: string;
    highlight?: boolean;
}) {
    return (
        <div
            className={cn("rounded-md border border-muted p-2", {
                "border-primary/30 bg-primary-50/40": highlight,
            })}
        >
            <p className="text-muted-foreground">{label}</p>
            <p className="font-medium text-sm">{value}</p>
        </div>
    );
}
