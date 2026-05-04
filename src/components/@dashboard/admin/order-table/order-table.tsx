"use client";

import {
    DataTable,
    Pagination,
    TableToolbar,
} from "@/components/common/shared/table";
import { useAllOrderQuery } from "@/redux/api/orderApi";

import { useTableFilters } from "@/hooks/use-table-filters";
import { orderColumns } from "./order-columns";

export default function OrderTable() {
    const {
        currentPage,
        limit,
        search,
        sortBy,
        queryParams,
        setCurrentPage,
        setSearch,
        setSortBy,
        handleLimitChange,
        handleResetFilters,
    } = useTableFilters({ defaultSortBy: "createdAt:desc" });

    const { data: orders, isLoading } = useAllOrderQuery(
        queryParams as Record<string, string>,
    );

    return (
        <div className="space-y-5 bg-white p-5 rounded-md">
            <TableToolbar
                search={search}
                limit={limit}
                sortBy={sortBy}
                setLimit={handleLimitChange}
                setSortBy={setSortBy}
                setSearch={setSearch}
                onReset={handleResetFilters}
                placeholder="Search by name"
            />

            <DataTable
                columns={orderColumns}
                data={orders?.result || []}
                rowKey={(row) => row.id}
                isFetching={isLoading}
            />

            {orders?.meta?.totalPages && orders?.meta?.totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                    totalPages={orders?.meta?.totalPages}
                    hasNextPage={orders?.meta?.hasNextPage}
                    hasPreviousPage={orders?.meta?.hasPreviousPage}
                    limit={Number(limit)}
                    totalData={orders?.meta?.totalData || 0}
                />
            )}
        </div>
    );
}
