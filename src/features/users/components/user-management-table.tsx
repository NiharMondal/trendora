"use client";

import { Users } from "lucide-react";

import { DataTable } from "@/shared/components/table";
import { useAllUserQuery } from "@/features/users/api/user.api";
import { userSortOptions } from "@/shared/constants/sort-options";
import { useTableFilters } from "@/shared/hooks/use-table-filters";
import { userManagementColumns } from "./user-management-columns";

export default function UserManagementTable() {
    const filters = useTableFilters({ defaultSortBy: "createdAt:desc" });

    const {
        data: users,
        isFetching,
        error: listError,
        refetch: refetchList,
    } = useAllUserQuery(filters.queryParams as Record<string, string>);

    return (
        <DataTable
            title="User management"
            description="Every active account on Trendora — shoppers, sellers and admins."
            icon={Users}
            columns={userManagementColumns}
            data={users?.result || []}
            rowKey={(row) => row.id}
            error={listError}
            onRetry={refetchList}
            isFetching={isFetching}
            filters={filters}
            meta={users?.meta}
            sortByOptions={userSortOptions}
            // The backend searches name, phone and email (case-insensitive).
            placeholder="Search by name, email or phone..."
            emptyState={{ title: "No users found" }}
        />
    );
}
