"use client";

import { Check, RotateCcw, Settings2, Store, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { vendorStatusMap } from "@/features/orders/constants/status-maps";
import {
    useAllVendorsForAdminQuery,
    useApproveVendorMutation,
    useReinstateVendorMutation,
} from "@/features/vendors/api/vendor.api";
import { TVendor, TVendorStatus } from "@/features/vendors/types/vendor.types";
import { DataTable, TableLoading } from "@/shared/components/table";
import { DataTableColumn } from "@/shared/components/table/table-types";
import { formatDate } from "@/shared/lib/format-date-time";
import { useTableFilters } from "@/shared/hooks/use-table-filters";
import { Button } from "@/shared/ui/button";
import { StatusBadge } from "@/shared/ui/status-badge";

import {
    VendorReasonModal,
    VendorSettingsModal,
} from "./vendor-action-modals";

const apiMessage = (error: unknown) =>
    (error as { data?: { message?: string } })?.data?.message;

/**
 * Admin view of every store.
 *
 * `statusFilter` lets the same table serve both the full list and the
 * applications queue — the backend narrows it via the standard `?status=`
 * column filter.
 */
export default function VendorAdminTable({
    statusFilter,
    title = "Vendors",
    description = "Every store on the marketplace.",
}: {
    statusFilter?: TVendorStatus;
    title?: string;
    description?: string;
}) {
    const filters = useTableFilters({ defaultSortBy: "createdAt:desc" });
    const [reasonTarget, setReasonTarget] = useState<{
        vendor: TVendor;
        mode: "reject" | "suspend";
    } | null>(null);
    const [settingsTarget, setSettingsTarget] = useState<TVendor | null>(null);

    const { data, isLoading, isFetching } = useAllVendorsForAdminQuery({
        ...(filters.queryParams as Record<string, string>),
        ...(statusFilter ? { status: statusFilter } : {}),
    });

    const [approveVendor, { isLoading: isApproving }] =
        useApproveVendorMutation();
    const [reinstateVendor, { isLoading: isReinstating }] =
        useReinstateVendorMutation();

    const handleApprove = async (vendor: TVendor) => {
        try {
            await approveVendor(vendor.id).unwrap();
            toast.success(
                `${vendor.storeName} approved — the owner is now a vendor`,
            );
        } catch (error) {
            toast.error(apiMessage(error) ?? "Could not approve this store");
        }
    };

    const handleReinstate = async (vendor: TVendor) => {
        try {
            await reinstateVendor(vendor.id).unwrap();
            toast.success(
                `${vendor.storeName} reinstated — their listings stay hidden until they republish`,
            );
        } catch (error) {
            toast.error(apiMessage(error) ?? "Could not reinstate this store");
        }
    };

    const isMutating = isApproving || isReinstating;

    const columns: DataTableColumn<TVendor>[] = [
        {
            key: "storeName",
            header: "Store",
            cell: (row) => (
                <div className="flex items-center gap-2">
                    <div className="size-10 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
                        {row.logo ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={row.logo}
                                alt={row.storeName}
                                className="size-full object-cover"
                            />
                        ) : (
                            <Store className="size-4 text-muted-foreground" />
                        )}
                    </div>
                    <div>
                        <Link
                            href={`/stores/${row.slug}`}
                            className="font-medium hover:underline"
                        >
                            {row.storeName}
                        </Link>
                        <p className="text-xs text-muted-foreground">
                            {row.businessEmail}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            key: "owner",
            header: "Owner",
            cell: (row) => (
                <div>
                    <p className="text-sm">{row.owner?.name ?? "—"}</p>
                    <p className="text-xs text-muted-foreground">
                        {row.owner?.auth?.email}
                        {row.owner?.auth?.role
                            ? ` · ${row.owner.auth.role}`
                            : ""}
                    </p>
                </div>
            ),
        },
        {
            key: "status",
            header: "Status",
            cell: (row) => (
                <div className="space-y-1">
                    <StatusBadge
                        statusMap={vendorStatusMap}
                        status={row.status}
                    />
                    {row.rejectionReason && (
                        <p className="text-xs text-muted-foreground max-w-[200px] line-clamp-2">
                            {row.rejectionReason}
                        </p>
                    )}
                </div>
            ),
        },
        {
            key: "commissionRate",
            header: "Commission",
            cell: (row) => (
                <span>{(Number(row.commissionRate) * 100).toFixed(1)}%</span>
            ),
        },
        {
            key: "_count",
            header: "Catalogue",
            cell: (row) => (
                <div className="text-xs">
                    <p>{row._count?.products ?? 0} products</p>
                    <p className="text-muted-foreground">
                        {row._count?.vendorOrders ?? 0} orders
                    </p>
                </div>
            ),
        },
        {
            key: "createdAt",
            header: "Applied",
            cell: (row) => <span>{formatDate(row.createdAt, "ll")}</span>,
        },
        {
            key: "actions",
            header: "Actions",
            cell: (row) => (
                <div className="flex flex-wrap items-center gap-1">
                    {/* PENDING and REJECTED are both approvable — the backend
                        refuses only an already-approved store. */}
                    {row.status !== "APPROVED" && row.status !== "SUSPENDED" && (
                        <Button
                            size="sm"
                            disabled={isMutating}
                            onClick={() => handleApprove(row)}
                        >
                            <Check className="size-3.5" />
                            Approve
                        </Button>
                    )}

                    {row.status === "PENDING" && (
                        <Button
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                                setReasonTarget({ vendor: row, mode: "reject" })
                            }
                        >
                            <X className="size-3.5" />
                            Reject
                        </Button>
                    )}

                    {row.status === "APPROVED" && (
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                                setReasonTarget({
                                    vendor: row,
                                    mode: "suspend",
                                })
                            }
                        >
                            Suspend
                        </Button>
                    )}

                    {row.status === "SUSPENDED" && (
                        <Button
                            size="sm"
                            variant="secondary"
                            disabled={isMutating}
                            onClick={() => handleReinstate(row)}
                        >
                            <RotateCcw className="size-3.5" />
                            Reinstate
                        </Button>
                    )}

                    <Button
                        size="icon"
                        variant="ghost"
                        title="Commercial terms"
                        onClick={() => setSettingsTarget(row)}
                    >
                        <Settings2 className="size-4" />
                    </Button>
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
                placeholder="Search stores..."
            />

            {reasonTarget && (
                <VendorReasonModal
                    key={`${reasonTarget.vendor.id}-${reasonTarget.mode}`}
                    vendor={reasonTarget.vendor}
                    mode={reasonTarget.mode}
                    open={!!reasonTarget}
                    onOpenChange={(open) => !open && setReasonTarget(null)}
                />
            )}

            {settingsTarget && (
                <VendorSettingsModal
                    key={settingsTarget.id}
                    vendor={settingsTarget}
                    open={!!settingsTarget}
                    onOpenChange={(open) => !open && setSettingsTarget(null)}
                />
            )}
        </div>
    );
}
