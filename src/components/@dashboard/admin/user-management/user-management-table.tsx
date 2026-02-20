import Pagination from "@/components/common/pagination";
import TableLoadingSkeleton from "@/components/common/table-loading-skeleton";
import { DataTable } from "@/components/common/td-table";
import { useAllUserQuery } from "@/redux/api/userApi";
import NoDataFound from "@/shared/no-data-found";
import TableToolbar from "@/shared/table/table-toolbar";
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
		<div className="space-y-4">
			<div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white border border-muted p-2 rounded-md">
				<TableToolbar
					search={search}
					setSearch={setSearch}
					limit={limit}
					setLimit={(val) => setLimit(val)}
				/>
			</div>
			<DataTable
				columns={userManagementColumns}
				data={users.result}
				rowKey={(row) => row.id}
			/>
			{users?.meta?.totalData &&
				users?.meta?.totalData > Number(limit) && (
					<Pagination
						currentPage={currentPage}
						onPageChange={setCurrentPage}
						totalPages={users?.meta?.totalPages || 0}
						limit={Number(limit)}
						totalData={users?.meta?.totalData || 0}
					/>
				)}
		</div>
	);
}
