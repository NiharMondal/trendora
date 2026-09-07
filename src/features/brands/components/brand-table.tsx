"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { DataTable, TableLoading } from "@/shared/components/table";
import TDButton from "@/shared/components/td-button";
import TDSheet from "@/shared/components/td-sheet";
import { categorySortOptions } from "@/shared/constants/sort-options";
import { TDModal } from "@/shared/components/td-modal";
import { TBrand } from "@/features/brands/types/brand.types";
import { Button } from "@/shared/ui/button";
import { useAllBrandQuery, useDeleteBrandMutation } from "@/features/brands/api/brand.api";

import { useTableFilters } from "@/shared/hooks/use-table-filters";
import { brandColumns } from "./brand-columns";
import EditBrand from "./edit-brand";

export default function BrandTable() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const brandId = searchParams.get("id");
    // filter section
    const filters = useTableFilters({ defaultSortBy: "createdAt:desc" });

    const [deleteBrandId, setDeleteBrandId] = useState<string | null>(null);
    const [deleteBrand, { isLoading: isDeleting }] = useDeleteBrandMutation();

    const {
        data: brands,
        isLoading,
        isFetching,
    } = useAllBrandQuery(filters.queryParams as Record<string, string>);

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
            <DataTable
                columns={brandColumns({ handleEdit, handleDelete })}
                data={brands?.result || []}
                rowKey={(row) => row.id}
                isFetching={isFetching}
                filters={filters}
                meta={brands?.meta}
                sortByOptions={categorySortOptions}
                placeholder="Search by name"
            />

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
