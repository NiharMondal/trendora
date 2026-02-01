import TableLoadingSkeleton from "@/components/common/table-loading-skeleton";
import { useAllUserQuery } from "@/redux/api/userApi";
import { DataTable } from "@/shared/data-table";
import NoDataFound from "@/shared/no-data-found";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import { userManagementColumns } from "./user-management-columns";

export default function UserManagementTable() {
    const [search, setSearch] = useState("");
    const [limit, setLimit] = useState("10");
    const [currentPage, setCurrentPage] = useState(1);

    const [value] = useDebounce(search, 1000);
    const { data: users, isLoading } = useAllUserQuery({
        search: value,
        limit: limit,
        page: currentPage.toString(),
    });

    if (isLoading) return <TableLoadingSkeleton />;

    if (!users?.result.length) {
        return <NoDataFound />;
    }
    return (
        <div>
            <DataTable
                columns={userManagementColumns}
                data={users.result}
                rowKey={(row) => row.id}
            />
        </div>
    );
}
