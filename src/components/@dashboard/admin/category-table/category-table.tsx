"use client";
import CategoryForm from "@/components/common/form/category-form";
import Pagination from "@/components/common/pagination";
import TDSheet from "@/components/common/td-sheet";
import { categorySortOptions } from "@/components/helpers/sort-options";
import { TDModal } from "@/components/package/TDModal";
import { Button } from "@/components/ui/button";
import { TCategoryFormValues } from "@/form-schema/category-schema";
import {
    useAllCategoryQuery,
    useCategoryByIdQuery,
    useDeleteCategoryMutation,
    useUpdateCategoryMutation,
} from "@/redux/api/productCategoryApi";
import { DataTable, TableLoading, TableToolbar } from "@/shared/table";
import { useState } from "react";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";
import { categoryColumns } from "./category-columns";

type Props = {};

export default function CategoryTable({}: Props) {
    const [openDrawer, setOpenDrawer] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
        null,
    );

    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState("10");
    const [search, setSearch] = useState("");
    const [value] = useDebounce(search, 1000);
    const [sortBy, setSortBy] = useState("createdAt:desc");

    const { data: selectedCategory } = useCategoryByIdQuery(
        selectedCategoryId!,
        { skip: !selectedCategoryId },
    );
    const [deleteCategory] = useDeleteCategoryMutation();
    const [updateCategory, { isLoading: isUpdating }] =
        useUpdateCategoryMutation();
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

    const handleDeleteCategory = async () => {
        if (!selectedCategoryId) return;
        try {
            await deleteCategory(selectedCategoryId).unwrap();
            toast.success("Category deleted successfully");
            setOpenModal(false);
            setSelectedCategoryId(null);
        } catch (error: any) {
            toast.error(error?.data?.message);
        }
    };

    const handleUpdateCategory = async (values: TCategoryFormValues) => {
        if (!selectedCategoryId) return;
        try {
            await updateCategory({
                payload: values,
                id: selectedCategoryId,
            }).unwrap();
            toast.success("Category updated successfully");
            setOpenDrawer(false);
            setSelectedCategoryId(null);
        } catch (error: any) {
            toast.error(error?.data?.message);
        }
    };

    const defaultValues: TCategoryFormValues | undefined = selectedCategory
        ? {
              name: selectedCategory.result?.name,
              parentId: selectedCategory.result?.parentId || "",
          }
        : undefined;

    const categoryOptions =
        categories?.result?.map((c) => ({
            label: c.name,
            value: c.id,
        })) || [];

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
                columns={categoryColumns({
                    onEdit: (category) => {
                        setSelectedCategoryId(category.id);
                        setOpenDrawer(true);
                    },
                    onDelete: (category) => {
                        setSelectedCategoryId(category.id);
                        setOpenModal(true);
                    },
                })}
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
                isOpen={openDrawer}
                setIsOpen={setOpenDrawer}
                title="Edit Category"
            >
                {selectedCategoryId && !selectedCategory ? (
                    <div>Loading...</div>
                ) : (
                    <CategoryForm
                        onSubmit={handleUpdateCategory}
                        isSubmitting={isUpdating}
                        defaultValues={defaultValues}
                        categories={categoryOptions}
                    />
                )}
            </TDSheet>

            <TDModal
                title="Delete Category"
                description="Are you sure you want to delete this category?"
                open={openModal}
                onOpenChange={setOpenModal}
            >
                <div className="flex justify-end gap-2 mt-4">
                    <Button
                        variant="outline"
                        onClick={() => setOpenModal(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDeleteCategory}
                    >
                        Delete
                    </Button>
                </div>
            </TDModal>
        </div>
    );
}
