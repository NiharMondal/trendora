"use client";
import Pagination from "@/components/common/pagination";
import TDButton from "@/components/common/td-button";
import TDSheet from "@/components/common/td-sheet";
import { categorySortOptions } from "@/components/helpers/sort-options";
import { TDModal } from "@/components/package/TDModal";
import { Button } from "@/components/ui/button";
import { useAllBrandQuery, useDeleteBrandMutation } from "@/redux/api/brandApi";
import { DataTable, TableLoading, TableToolbar } from "@/shared/table";
import { TBrand } from "@/types/brand.types";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";
import { brandColumns } from "./brand-columns";
import EditBrand from "./edit-brand";

export default function BrandTable() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const brandId = searchParams.get("id");
	// filter section
	const [currentPage, setCurrentPage] = useState(1);
	const [limit, setLimit] = useState("10");
	const [search, setSearch] = useState("");
	const [value] = useDebounce(search, 1000);
	const [sortBy, setSortBy] = useState("createdAt:desc");

	const [deleteBrandId, setDeleteBrandId] = useState<string | null>(null);
	const [deleteBrand, { isLoading: isDeleting }] = useDeleteBrandMutation();

	const {
		data: brands,
		isLoading,
		isFetching,
	} = useAllBrandQuery({
		search: value,
		limit: limit,
		page: currentPage.toString(),
		sortBy: sortBy,
	});

	const handleEdit = (category: TBrand) => {
		router.push(`?id=${category.id}`, { scroll: false });
	};
	const handleCloseDrawer = () => {
		router.push(`?`, { scroll: false });
	};
	const handleDelete = (category: TBrand) => {
		setDeleteBrandId(category.id);
	};

	const confirmDelete = async () => {
		if (!deleteBrandId) return;
		try {
			await deleteBrand(deleteBrandId).unwrap();
			toast.success("Category deleted successfully");
			setDeleteBrandId(null);
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
				columns={brandColumns({ handleEdit, handleDelete })}
				data={brands?.result || []}
				rowKey={(row) => row.id}
				isFetching={isFetching}
			/>
			{brands?.meta?.totalData &&
				brands?.meta?.totalData > Number(limit) && (
					<Pagination
						currentPage={currentPage}
						onPageChange={setCurrentPage}
						totalPages={brands?.meta?.totalPages || 0}
						limit={Number(limit)}
						totalData={brands?.meta?.totalData || 0}
					/>
				)}

			<TDSheet
				isOpen={!!brandId}
				setIsOpen={(open) => !open && handleCloseDrawer()}
				title="Edit Brand"
			>
				<EditBrand onClose={handleCloseDrawer} />
			</TDSheet>

			<TDModal
				open={!!deleteBrandId}
				onOpenChange={(open) => !open && setDeleteBrandId(null)}
				title="Are you sure you want to delete this brand?"
				description="This action cannot be undone."
			>
				<div className="flex justify-end gap-2 mt-4">
					<Button
						variant="outline"
						onClick={() => setDeleteBrandId(null)}
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
