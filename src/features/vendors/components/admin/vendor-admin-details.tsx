"use client";

import { ArrowLeft, ExternalLink, Star, Store } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { currencyFormatter } from "@/features/cart/utils/calculate-order-total";
import { vendorStatusMap } from "@/features/orders/constants/status-maps";
import { useVendorByIdForAdminQuery } from "@/features/vendors/api/vendor.api";
import SpinnerLoading from "@/shared/components/loading/spinner-loading";
import QueryError from "@/shared/components/query-error";
import RowText from "@/shared/components/row-text";
import { formatDate } from "@/shared/lib/format-date-time";
import { Button } from "@/shared/ui/button";
import { StatusBadge } from "@/shared/ui/status-badge";

import VendorModerationActions from "./vendor-moderation-actions";

const WHEN = "MMM Do, YYYY HH:mm A" as const;

/** `payoutDetails` is free-form JSON; show its scalar fields, labelled. */
const payoutRows = (details?: Record<string, unknown> | null) =>
    Object.entries(details ?? {})
        .filter(([, value]) => value !== null && typeof value !== "object")
        .map(([key, value]) => ({
            label: key
                .replace(/([a-z])([A-Z])/g, "$1 $2")
                .replace(/_/g, " ")
                .replace(/^./, (c) => c.toUpperCase()),
            value: String(value),
        }));

/**
 * One store, from the operator's side.
 *
 * Everything an admin needs before a moderation decision in one place: who owns
 * it, its commercial terms, how much it trades, where its payouts go, and the
 * full moderation trail — including who acted and from which IP, which only
 * the admin read carries (`sanitizeVendorHistory`).
 */
export default function VendorAdminDetails({ id }: { id: string }) {
    const { data, isLoading, error, refetch } = useVendorByIdForAdminQuery(id);

    if (isLoading) return <SpinnerLoading />;
    if (error) {
        return (
            <QueryError
                error={error}
                onRetry={refetch}
                title="Could not load this store"
                notFound={{
                    title: "Store not found",
                    description: "It may have been deleted, or the link is wrong.",
                }}
            />
        );
    }

    const vendor = data?.result;
    if (!vendor) return null;

    const payout = payoutRows(vendor.payoutDetails);
    const history = vendor.statusHistory ?? [];

    return (
        <div className="space-y-5">
            <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/vendor-list">
                    <ArrowLeft className="size-4" />
                    Back to vendors
                </Link>
            </Button>

            {/* Identity + moderation */}
            <div className="bg-white rounded-md p-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-4">
                    <div className="relative size-16 shrink-0 overflow-hidden rounded-full bg-muted flex items-center justify-center">
                        {vendor.logo ? (
                            <Image
                                src={vendor.logo}
                                alt=""
                                fill
                                sizes="64px"
                                className="object-cover"
                            />
                        ) : (
                            <Store className="size-6 text-muted-foreground" />
                        )}
                    </div>
                    <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-3">
                            <h3>{vendor.storeName}</h3>
                            <StatusBadge
                                statusMap={vendorStatusMap}
                                status={vendor.status}
                            />
                            {vendor.isDeleted && (
                                <span className="text-xs text-red-600">
                                    Deleted
                                </span>
                            )}
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                            {vendor.status === "APPROVED" ? (
                                <Link
                                    href={`/stores/${vendor.slug}`}
                                    className="inline-flex items-center gap-1 hover:underline"
                                >
                                    /stores/{vendor.slug}
                                    <ExternalLink className="size-3" />
                                </Link>
                            ) : (
                                <span>/stores/{vendor.slug}</span>
                            )}
                            {vendor.averageRating ? (
                                <span className="flex items-center gap-1">
                                    <Star className="size-3.5 fill-amber-400 text-amber-400" />
                                    {Number(vendor.averageRating).toFixed(1)} (
                                    {vendor.totalReviews})
                                </span>
                            ) : (
                                <span>No reviews yet</span>
                            )}
                        </div>
                    </div>
                </div>
                <VendorModerationActions vendor={vendor} />
            </div>

            {vendor.rejectionReason && (
                <div className="rounded-md border border-destructive-100 bg-destructive-50 p-4 text-sm">
                    <p className="font-medium text-destructive-600">
                        {vendor.status === "SUSPENDED"
                            ? "Suspension reason"
                            : "Rejection reason"}
                    </p>
                    <p>{vendor.rejectionReason}</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Business */}
                <div className="bg-white rounded-md p-5 space-y-2 text-sm">
                    <h5 className="font-semibold">Business</h5>
                    <RowText
                        title="Owner"
                        value={vendor.owner?.name ?? "—"}
                    />
                    <RowText
                        title="Owner login"
                        value={
                            vendor.owner?.auth
                                ? `${vendor.owner.auth.email} · ${vendor.owner.auth.role}`
                                : "—"
                        }
                    />
                    <RowText title="Email" value={vendor.businessEmail} />
                    <RowText title="Phone" value={vendor.businessPhone} />
                    <RowText title="Tax ID" value={vendor.taxId ?? "—"} />
                    <RowText
                        title="Applied"
                        value={formatDate(vendor.createdAt, "ll")}
                    />
                    <RowText
                        title="Approved"
                        value={
                            vendor.approvedAt
                                ? formatDate(vendor.approvedAt, "ll")
                                : "—"
                        }
                    />
                    {vendor.suspendedAt && (
                        <RowText
                            title="Suspended"
                            value={formatDate(vendor.suspendedAt, "ll")}
                        />
                    )}
                    {vendor.description && (
                        <p className="pt-2 text-xs text-muted-foreground line-clamp-4">
                            {vendor.description}
                        </p>
                    )}
                </div>

                {/* Terms + activity */}
                <div className="bg-white rounded-md p-5 space-y-2 text-sm">
                    <h5 className="font-semibold">Commercial terms</h5>
                    <RowText
                        title="Commission"
                        value={`${(Number(vendor.commissionRate) * 100).toFixed(1)}%`}
                    />
                    <RowText
                        title="Delivery fee"
                        value={currencyFormatter(Number(vendor.shippingFee))}
                    />
                    <RowText
                        title="Free delivery over"
                        value={currencyFormatter(
                            Number(vendor.freeShippingThreshold),
                        )}
                    />
                    <p className="text-xs text-muted-foreground">
                        A change applies to orders placed from then on; past
                        orders keep the terms they were priced with.
                    </p>

                    <h5 className="font-semibold pt-3">Activity</h5>
                    <RowText
                        title="Products"
                        value={vendor._count?.products ?? 0}
                    />
                    <RowText
                        title="Parcels sold"
                        value={vendor._count?.vendorOrders ?? 0}
                    />
                    <RowText
                        title="Payouts"
                        value={vendor._count?.payouts ?? 0}
                    />
                </div>

                {/* Payout destination */}
                <div className="bg-white rounded-md p-5 space-y-2 text-sm">
                    <h5 className="font-semibold">Payout details</h5>
                    {payout.length ? (
                        payout.map((row) => (
                            <RowText
                                key={row.label}
                                title={row.label}
                                value={row.value}
                            />
                        ))
                    ) : (
                        <p className="text-muted-foreground">
                            None on file. The seller adds them in their
                            application.
                        </p>
                    )}
                    <p className="text-xs text-muted-foreground pt-2">
                        Settlements are run from{" "}
                        <Link href="/admin/payouts" className="underline">
                            Outstanding payouts
                        </Link>
                        .
                    </p>
                </div>
            </div>

            {/* Moderation trail */}
            <div className="bg-white rounded-md p-5 space-y-4">
                <div>
                    <h5 className="font-semibold">Moderation history</h5>
                    <p className="text-xs text-muted-foreground">
                        Every change to this store&apos;s state, newest first. A
                        terms change keeps the same status and describes the
                        change in its note.
                    </p>
                </div>
                {history.length ? (
                    <ol className="space-y-4 border-l pl-4">
                        {history.map((event) => (
                            <li key={event.id} className="space-y-1 text-sm">
                                <div className="flex flex-wrap items-center gap-2">
                                    {event.oldStatus &&
                                        event.oldStatus !== event.newStatus && (
                                            <>
                                                <StatusBadge
                                                    statusMap={vendorStatusMap}
                                                    status={event.oldStatus}
                                                />
                                                <span aria-hidden>→</span>
                                            </>
                                        )}
                                    <StatusBadge
                                        statusMap={vendorStatusMap}
                                        status={event.newStatus}
                                    />
                                    <span className="text-xs text-muted-foreground">
                                        {formatDate(event.createdAt, WHEN)}
                                    </span>
                                </div>
                                {event.note && <p>{event.note}</p>}
                                <p className="text-xs text-muted-foreground">
                                    By {event.actor?.name ?? "system"}
                                    {event.ipAddress
                                        ? ` · ${event.ipAddress}`
                                        : ""}
                                </p>
                            </li>
                        ))}
                    </ol>
                ) : (
                    <p className="text-sm text-muted-foreground">
                        No recorded changes. Stores created before the audit
                        log existed start with an empty trail.
                    </p>
                )}
            </div>
        </div>
    );
}
