"use client";

import TDSheet from "@/components/common/td-sheet";
import { useAllOrderQuery } from "@/redux/api/orderApi";
import { DataTable, Pagination, TableToolbar } from "@/shared/table";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import { orderColumns } from "./order-columns";

export default function OrderTable() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const orderId = searchParams.get("id");

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

	const handleClick = (id: string) => {
		router.push(`?id=${id}`, { scroll: false });
	};

	const handleCloseDrawer = () => {
		router.push(`?`, { scroll: false });
	};

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
				columns={orderColumns({ handleClick })}
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
				/>
			)}

			<TDSheet
				isOpen={!!orderId}
				setIsOpen={(open) => !open && handleCloseDrawer()}
				title="View Order Details"
			>
				<div>Hello World</div>
			</TDSheet>
		</div>
	);
}
