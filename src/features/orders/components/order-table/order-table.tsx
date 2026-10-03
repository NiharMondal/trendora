"use client";

import { DataTable } from "@/shared/components/table";
import { useAllOrderQuery } from "@/features/orders/api/order.api";

import { useTableFilters } from "@/shared/hooks/use-table-filters";
import { orderColumns } from "./order-columns";

export default function OrderTable() {
    const filters = useTableFilters({ defaultSortBy: "createdAt:desc" });

    const { data: orders, isLoading } = useAllOrderQuery(
        filters.queryParams as Record<string, string>,
    );

    return (
        <div className="space-y-5 bg-white p-5 rounded-md">
            <DataTable
                columns={orderColumns}
                data={orders?.result || []}
                rowKey={(row) => row.id}
                isFetching={isLoading}
                filters={filters}
                meta={orders?.meta}
                placeholder="Search by name"
            />
        </div>
    );
}
