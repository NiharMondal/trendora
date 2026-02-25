"use client";

import { useAllOrderQuery } from "@/redux/api/orderApi";
import { DataTable, Pagination, TableToolbar } from "@/shared/table";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import { orderColumns } from "./order-columns";

export default function OrderTable() {
	// filter section
	const [currentPage, setCurrentPage] = useState(1);
	const [limit, setLimit] = useState("10");
	const [search, setSearch] = useState("");
	const [value] = useDebounce(search, 1000);
	const [sortBy, setSortBy] = useState("createdAt:desc");
	const { data: orders, isLoading } = useAllOrderQuery({
		page: currentPage.toString(),
		limit: limit,
		search: value,
		sortBy: sortBy,
	});

	const handleLimitChange = (value: string) => {
		setLimit(value);
		setCurrentPage(1);
	};

	const handleResetFilters = () => {
		setCurrentPage(1);
	};

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
