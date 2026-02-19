"use client";
import Pagination from "@/components/common/pagination";
import TDButton from "@/components/common/td-button";
import TDSheet from "@/components/common/td-sheet";
import { categorySortOptions } from "@/components/helpers/sort-options";
import { TDModal } from "@/components/package/TDModal";
import { Button } from "@/components/ui/button";
import { DataTable, TableLoading, TableToolbar } from "@/shared/table";
import { TSize } from "@/types/size.types";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";

import { useAllSizesQuery, useDeleteSizeMutation } from "@/redux/api/size";
import EditSize from "./edit-size";
import { sizeColumns } from "./size-columns";

export default function SizeTable() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const categoryId = searchParams.get("id");
	// filter section
	const [currentPage, setCurrentPage] = useState(1);
	const [limit, setLimit] = useState("10");
	const [search, setSearch] = useState("");
	const [value] = useDebounce(search, 1000);
	const [sortBy, setSortBy] = useState("createdAt:desc");

	const [deleteSizeId, setDeleteSizeId] = useState<string | null>(null);
	const [deleteSize, { isLoading: isDeleting }] = useDeleteSizeMutation();

	const {
		data: sizes,
		isLoading,
		isFetching,
	} = useAllSizesQuery({
		search: value,
		limit: limit,
		page: currentPage.toString(),
		sortBy: sortBy,
	});

	const handleEdit = (size: TSize) => {
		router.push(`?id=${size.id}`, { scroll: false });
	};
	const handleCloseDrawer = () => {
		router.push(`?`, { scroll: false });
	};
	const handleDelete = (size: TSize) => {
		setDeleteSizeId(size.id);
	};

	const confirmDelete = async () => {
		if (!deleteSizeId) return;
		try {
			await deleteSize(deleteSizeId).unwrap();
			toast.success("Size deleted successfully");
			setDeleteSizeId(null);
		} catch (error: any) {
			toast.error(error?.data?.message);
		}
	};
	if (isLoading) return <TableLoading />;
	return (
		<div className="space-y-5 bg-white p-5 rounded-md">
			<TableToolbar
				search={search}
				limit={limit}
				sortBy={sortBy}
				setLimit={setLimit}
				setSortBy={setSortBy}
				setSearch={setSearch}
				sortByOptions={categorySortOptions}
				placeholder="Search by name"
			/>

			<DataTable
				columns={sizeColumns({ handleEdit, handleDelete })}
				data={sizes?.result || []}
				rowKey={(row) => row.id}
				isFetching={isFetching}
			/>
			{sizes?.meta?.totalData && sizes?.meta?.totalData > Number(limit) && (
				<Pagination
					currentPage={currentPage}
					onPageChange={setCurrentPage}
					totalPages={sizes?.meta?.totalPages || 0}
					limit={Number(limit)}
					totalData={sizes?.meta?.totalData || 0}
				/>
			)}

			<TDSheet
				isOpen={!!categoryId}
				setIsOpen={(open) => !open && handleCloseDrawer()}
				title="Edit Size"
			>
				<EditSize onClose={handleCloseDrawer} />
			</TDSheet>

			<TDModal
				open={!!deleteSizeId}
				onOpenChange={(open) => !open && setDeleteSizeId(null)}
				title="Are you sure you want to delete this size?"
				description="This action cannot be undone."
			>
				<div className="flex justify-end gap-2 mt-4">
					<Button
						variant="outline"
						onClick={() => setDeleteSizeId(null)}
					>
						Cancel
					</Button>
					<TDButton
						variant="destructive"
						onClick={confirmDelete}
						disabled={isDeleting}
					>
						{isDeleting ? "Deleting..." : "Delete"}
					</TDButton>
				</div>
			</TDModal>
		</div>
	);
}
