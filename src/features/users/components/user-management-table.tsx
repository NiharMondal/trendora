import { DataTable, TableLoading } from "@/shared/components/table";
import { useAllUserQuery } from "@/features/users/api/user.api";

import { userSortOptions } from "@/shared/constants/sort-options";
import { useTableFilters } from "@/shared/hooks/use-table-filters";
import { userManagementColumns } from "./user-management-columns";

export default function UserManagementTable() {
    const filters = useTableFilters({ defaultSortBy: "createdAt:desc" });

    const {
        data: users,
        isLoading,
        isFetching,
        error: listError,
        refetch: refetchList,
    } = useAllUserQuery(filters.queryParams as Record<string, string>);

    if (isLoading) return <TableLoading />;

    return (
        <DataTable
            columns={userManagementColumns}
            data={users?.result || []}
            rowKey={(row) => row.id}
            error={listError}
            onRetry={refetchList}
            isFetching={isFetching}
            filters={filters}
            meta={users?.meta}
            sortByOptions={userSortOptions}
            placeholder="Search by name, email..."
        />
    );
}
