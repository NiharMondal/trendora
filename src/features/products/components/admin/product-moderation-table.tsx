"use client";

import { Check, Eye, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { productStatusMap } from "@/features/orders/constants/status-maps";
import {
    useAllProductsForAdminQuery,
    useApproveProductMutation,
    useRejectProductMutation,
} from "@/features/products/api/product.api";
import { TProduct, TProductModerationStatus } from "@/features/products/types/product.types";
import { DataTable, TableLoading } from "@/shared/components/table";
import { DataTableColumn } from "@/shared/components/table/table-types";
import TDButton from "@/shared/components/td-button";
import { TDModal } from "@/shared/components/td-modal";
import { formatDate } from "@/shared/lib/format-date-time";
import { useTableFilters } from "@/shared/hooks/use-table-filters";
import { Button } from "@/shared/ui/button";
import { StatusBadge } from "@/shared/ui/status-badge";
import { Textarea } from "@/shared/ui/textarea";

const apiMessage = (error: unknown) =>
    (error as { data?: { message?: string } })?.data?.message;

/**
 * The listing review queue.
 *
 * Defaults to PENDING because that is the work; `statusFilter` is overridable
 * so the same table can show the whole catalogue across every store.
 */
export default function ProductModerationTable({
    statusFilter = "PENDING",
    title = "Listings awaiting review",
    description = "Approve a listing to let its store publish it to the storefront.",
}: {
    statusFilter?: TProductModerationStatus | "ALL";
    title?: string;
    description?: string;
}) {
    const filters = useTableFilters({ defaultSortBy: "createdAt:desc" });
    const [rejectTarget, setRejectTarget] = useState<TProduct | null>(null);
    const [reason, setReason] = useState("");

    const { data, isLoading, isFetching } = useAllProductsForAdminQuery({
        ...(filters.queryParams as Record<string, string>),
        ...(statusFilter !== "ALL" ? { status: statusFilter } : {}),
    });

    const [approveProduct, { isLoading: isApproving }] =
        useApproveProductMutation();
    const [rejectProduct, { isLoading: isRejecting }] =
        useRejectProductMutation();

    const handleApprove = async (product: TProduct) => {
        try {
            await approveProduct(product.id).unwrap();
            toast.success(`"${product.name}" approved`);
        } catch (error) {
            toast.error(apiMessage(error) ?? "Could not approve this listing");
        }
    };

    const handleReject = async () => {
        if (!rejectTarget) return;

        // The backend requires at least 10 characters — check before the call
        // so the seller always gets something actionable.
        if (reason.trim().length < 10) {
            toast.error("Give a reason of at least 10 characters");
            return;
        }

        try {
            await rejectProduct({
                id: rejectTarget.id,
                payload: { reason: reason.trim() },
            }).unwrap();
            toast.success("Listing rejected");
            setRejectTarget(null);
            setReason("");
        } catch (error) {
            toast.error(apiMessage(error) ?? "Could not reject this listing");
        }
    };

    const columns: DataTableColumn<TProduct>[] = [
        {
            key: "name",
            header: "Product",
            cell: (row) => {
                const main = row?.images?.find((image) => image.isMain);
                const src = main?.url || row.images?.[0]?.url;
                return (
                    <div className="flex items-center gap-x-2">
                        <div className="size-12 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
                            {src ? (
                                <Image
                                    src={src}
                                    alt={row.name}
                                    className="size-full object-cover"
                                    width={60}
                                    height={60}
                                    loading="lazy"
                                />
                            ) : null}
                        </div>
                        <div className="max-w-[240px]">
                            <p className="font-medium line-clamp-1">
                                {row.name}
                            </p>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                                {row.description}
                            </p>
                        </div>
                    </div>
                );
            },
        },
        {
            key: "vendor",
            header: "Store",
            cell: (row) =>
                row.vendor ? (
                    <Link
                        href={`/stores/${row.vendor.slug}`}
                        className="text-sm hover:underline"
                    >
                        {row.vendor.storeName}
                    </Link>
                ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                ),
        },
        {
            key: "category",
            header: "Category",
            cell: (row) => (
                <div className="text-xs">
                    <p>{row.category?.name}</p>
                    <p className="text-muted-foreground">{row.brand?.name}</p>
                </div>
            ),
        },
        {
            key: "basePrice",
            header: "Price",
            cell: (row) => <span>${row.discountPrice ?? row.basePrice}</span>,
        },
        {
            key: "status",
            header: "Status",
            cell: (row) => (
                <StatusBadge statusMap={productStatusMap} status={row.status} />
            ),
        },
        {
            key: "submittedAt",
            header: "Submitted",
            cell: (row) => (
                <span className="text-xs">
                    {row.submittedAt ? formatDate(row.submittedAt, "ll") : "—"}
                </span>
            ),
        },
        {
            key: "actions",
            header: "Actions",
            cell: (row) => (
                <div className="flex items-center gap-1">
                    <Link href={`/admin/product-list/${row.id}`}>
                        <Button variant="ghost" size="icon" title="Inspect">
                            <Eye className="size-4" />
                        </Button>
                    </Link>

                    {row.status !== "APPROVED" && (
                        <Button
                            size="sm"
                            disabled={isApproving}
                            onClick={() => handleApprove(row)}
                        >
                            <Check className="size-3.5" />
                            Approve
                        </Button>
                    )}

                    {row.status !== "REJECTED" && (
                        <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                                setRejectTarget(row);
                                setReason("");
                            }}
                        >
                            <X className="size-3.5" />
                            Reject
                        </Button>
                    )}
                </div>
            ),
        },
    ];

    if (isLoading) return <TableLoading />;

    return (
        <div className="space-y-5 bg-white p-5 rounded-md">
            <div>
                <h5 className="text-lg font-semibold">{title}</h5>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>

            <DataTable
                columns={columns}
                data={data?.result || []}
                rowKey={(row) => row.id}
                isFetching={isFetching}
                filters={filters}
                meta={data?.meta}
                placeholder="Search listings..."
            />

            <TDModal
                open={!!rejectTarget}
                onOpenChange={(open) => {
                    if (!open) {
                        setRejectTarget(null);
                        setReason("");
                    }
                }}
                title="Reject this listing"
                description={rejectTarget?.name}
            >
                <div className="space-y-4">
                    <Textarea
                        value={reason}
                        onChange={(event) => setReason(event.target.value)}
                        placeholder="What does the seller need to change? They see this."
                        rows={4}
                    />
                    <p className="text-xs text-muted-foreground">
                        The listing is unpublished and the seller can fix it and
                        resubmit.
                    </p>
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setRejectTarget(null)}
                        >
                            Cancel
                        </Button>
                        <TDButton
                            variant="destructive"
                            onClick={handleReject}
                            isLoading={isRejecting}
                        >
                            Reject
                        </TDButton>
                    </div>
                </div>
            </TDModal>
        </div>
    );
}
