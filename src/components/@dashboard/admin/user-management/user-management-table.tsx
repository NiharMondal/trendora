import {
    DataTable,
    Pagination,
    TableLoading,
} from "@/components/common/shared/table";
import TableToolbar from "@/components/common/shared/table/table-toolbar";
import { useAllUserQuery } from "@/redux/api/userApi";

import { userSortOptions } from "@/components/helpers/sort-options";
import { useTableFilters } from "@/hooks/use-table-filters";
import { userManagementColumns } from "./user-management-columns";

export default function UserManagementTable() {
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

    const {
        data: users,
        isLoading,
        isFetching,
    } = useAllUserQuery(queryParams as Record<string, string>);

    if (isLoading) return <TableLoading />;

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white border border-muted p-2 rounded-md">
                <TableToolbar
                    search={search}
                    setSearch={setSearch}
                    limit={limit}
                    setLimit={handleLimitChange}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    onReset={handleResetFilters}
                    placeholder="Search by name, email..."
                    sortByOptions={userSortOptions}
                />
            </div>
            <DataTable
                columns={userManagementColumns}
                data={users?.result || []}
                rowKey={(row) => row.id}
                isFetching={isFetching}
            />
            {users?.meta?.totalPages && users?.meta?.totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                    totalPages={users?.meta?.totalPages || 0}
                    hasNextPage={users?.meta?.hasNextPage}
                    hasPreviousPage={users?.meta?.hasPreviousPage}
                    limit={Number(limit)}
                    totalData={users?.meta?.totalData || 0}
                />
            )}
        </div>
    );
}
