import { DataTable, TableLoading } from "@/components/common/shared/table";
import { useAllUserQuery } from "@/redux/api/userApi";

import { userSortOptions } from "@/components/helpers/sort-options";
import { useTableFilters } from "@/hooks/use-table-filters";
import { userManagementColumns } from "./user-management-columns";

export default function UserManagementTable() {
    const filters = useTableFilters({ defaultSortBy: "createdAt:desc" });

    const {
        data: users,
        isLoading,
        isFetching,
    } = useAllUserQuery(filters.queryParams as Record<string, string>);

    if (isLoading) return <TableLoading />;

    return (
        <DataTable
            columns={userManagementColumns}
            data={users?.result || []}
            rowKey={(row) => row.id}
            isFetching={isFetching}
            filters={filters}
            meta={users?.meta}
            sortByOptions={userSortOptions}
            placeholder="Search by name, email..."
        />
    );
}
