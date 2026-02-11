"use client";
import Pagination from "@/components/common/pagination";
import TDSheet from "@/components/common/td-sheet";
import { categorySortOptions } from "@/components/helpers/sort-options";
import { TDModal } from "@/components/package/TDModal";
import { Button } from "@/components/ui/button";
import {
    useAllCategoryQuery,
    useDeleteCategoryMutation,
} from "@/redux/api/productCategoryApi";
import { DataTable, TableLoading, TableToolbar } from "@/shared/table";
import { TCategory } from "@/types/category.types";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";
import { categoryColumns } from "./category-columns";
import EditCategory from "./edit-category";
import TDButton from "@/components/common/td-button";

export default function CategoryTable() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const categoryId = searchParams.get("categoryId");
    // filter section
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState("10");
    const [search, setSearch] = useState("");
    const [value] = useDebounce(search, 1000);
    const [sortBy, setSortBy] = useState("createdAt:desc");

    const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(
        null,
    );
    const [deleteCategory, { isLoading: isDeleting }] =
        useDeleteCategoryMutation();

    const {
        data: categories,
        isLoading,
        isFetching,
    } = useAllCategoryQuery({
        search: value,
        limit: limit,
        page: currentPage.toString(),
        sortBy: sortBy,
    });

    const handleEdit = (category: TCategory) => {
        router.push(`?categoryId=${category.id}`, { scroll: false });
    };
    const handleCloseDrawer = () => {
        router.push(`?`, { scroll: false });
    };
    const handleDelete = (category: TCategory) => {
        setDeleteCategoryId(category.id);
    };

    const confirmDelete = async () => {
        if (!deleteCategoryId) return;
        try {
            await deleteCategory(deleteCategoryId).unwrap();
            toast.success("Category deleted successfully");
            setDeleteCategoryId(null);
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
                columns={categoryColumns({ handleEdit, handleDelete })}
                data={categories?.result || []}
                rowKey={(row) => row.id}
                isFetching={isFetching}
            />
            {categories?.result && categories.result.length > 10 && (
                <Pagination
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                    totalPages={categories?.meta?.totalPages || 0}
                    limit={Number(limit)}
                    totalData={categories?.meta?.totalData || 0}
                />
            )}

            <TDSheet
                isOpen={!!categoryId}
                setIsOpen={(open) => !open && handleCloseDrawer()}
                title="Edit Category"
            >
                <EditCategory
                    onClose={handleCloseDrawer}
                    categories={categories?.result || []}
                />
            </TDSheet>

            <TDModal
                open={!!deleteCategoryId}
                onOpenChange={(open) => !open && setDeleteCategoryId(null)}
                title="Are you sure you want to delete this category?"
                description="This action cannot be undone."
            >
                <div className="flex justify-end gap-2 mt-4">
                    <Button
                        variant="outline"
                        onClick={() => setDeleteCategoryId(null)}
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
