"use client";
import Pagination from "@/components/common/pagination";
import TDSheet from "@/components/common/td-sheet";
import { categorySortOptions } from "@/components/helpers/sort-options";
import { TDModal } from "@/components/package/TDModal";
import { Button } from "@/components/ui/button";
import { DataTable, TableLoading, TableToolbar } from "@/shared/table";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";

import TDButton from "@/components/common/td-button";
import {
	useAllSizeGroupsQuery,
	useDeleteSizeGroupMutation,
} from "@/redux/api/sizeGroupApi";
import { TSizeGroup } from "@/types/size-group.types";
import EditSizeGroup from "./edit-size-group";
import { sizeGroupColumns } from "./size-group-columns";

export default function CategoryTable() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const sizeGroupId = searchParams.get("id");
	// filter section
	const [currentPage, setCurrentPage] = useState(1);
	const [limit, setLimit] = useState("10");
	const [search, setSearch] = useState("");
	const [value] = useDebounce(search, 1000);
	const [sortBy, setSortBy] = useState("createdAt:desc");

	const [deleteSizeGroupId, setDeleteSizeGroupId] = useState<string | null>(
		null,
	);
	const [deleteSizeGroup, { isLoading: isDeleting }] =
		useDeleteSizeGroupMutation();
	const {
		data: sizeGroups,
		isLoading,
		isFetching,
	} = useAllSizeGroupsQuery({
		search: value,
		limit: limit,
		page: currentPage.toString(),
		sortBy: sortBy,
	});

	const handleEdit = (sizeGroup: TSizeGroup) => {
		router.push(`?id=${sizeGroup.id}`, { scroll: false });
	};
	const handleCloseDrawer = () => {
		router.push(`?`, { scroll: false });
	};
	const handleDelete = (sizeGroup: TSizeGroup) => {
		setDeleteSizeGroupId(sizeGroup.id);
	};

	const confirmDelete = async () => {
		if (!deleteSizeGroupId) return;
		try {
			await deleteSizeGroup(deleteSizeGroupId).unwrap();
			toast.success("Size group deleted successfully");
			setDeleteSizeGroupId(null);
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
				columns={sizeGroupColumns({ handleEdit, handleDelete })}
				data={sizeGroups?.result || []}
				rowKey={(row) => row.id}
				isFetching={isFetching}
			/>
			{sizeGroups?.meta?.totalData &&
				sizeGroups?.meta?.totalData > Number(limit) && (
					<Pagination
						currentPage={currentPage}
						onPageChange={setCurrentPage}
						totalPages={sizeGroups?.meta?.totalPages || 0}
						limit={Number(limit)}
						totalData={sizeGroups?.meta?.totalData || 0}
					/>
				)}

			<TDSheet
				isOpen={!!sizeGroupId}
				setIsOpen={(open) => !open && handleCloseDrawer()}
				title="Edit Size Group"
			>
				<EditSizeGroup onClose={handleCloseDrawer} />
			</TDSheet>

			<TDModal
				open={!!deleteSizeGroupId}
				onOpenChange={(open) => !open && setDeleteSizeGroupId(null)}
				title="Are you sure you want to delete this size group?"
				description="This action cannot be undone."
			>
				<div className="flex justify-end gap-2 mt-4">
					<Button
						variant="outline"
						onClick={() => setDeleteSizeGroupId(null)}
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
