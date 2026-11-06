"use client";

import { Store } from "lucide-react";
import Link from "next/link";

import { vendorStatusMap } from "@/features/orders/constants/status-maps";
import { useAllVendorsForAdminQuery } from "@/features/vendors/api/vendor.api";
import { TVendor, TVendorStatus } from "@/features/vendors/types/vendor.types";
import { DataTable, TableLoading } from "@/shared/components/table";
import { DataTableColumn } from "@/shared/components/table/table-types";
import { formatDate } from "@/shared/lib/format-date-time";
import { useTableFilters } from "@/shared/hooks/use-table-filters";
import { StatusBadge } from "@/shared/ui/status-badge";

import VendorModerationActions from "./vendor-moderation-actions";

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
    const {
        data,
        isLoading,
        isFetching,
        error: listError,
        refetch: refetchList,
    } = useAllVendorsForAdminQuery({
        ...(filters.queryParams as Record<string, string>),
        ...(statusFilter ? { status: statusFilter } : {}),
    });

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
                            href={`/admin/vendor-list/${row.id}`}
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
            cell: (row) => <VendorModerationActions vendor={row} compact />,
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
                error={listError}
                onRetry={refetchList}
                isFetching={isFetching}
                filters={filters}
                meta={data?.meta}
                placeholder="Search stores..."
            />
        </div>
    );
}
