"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { DataTable, TableLoading } from "@/shared/components/table";
import TDButton from "@/shared/components/td-button";
import TDSheet from "@/shared/components/td-sheet";
import { categorySortOptions } from "@/shared/constants/sort-options";
import { TDModal } from "@/shared/components/td-modal";
import { TSize } from "@/components/types/size.types";
import { Button } from "@/shared/ui/button";
import { useAllSizesQuery, useDeleteSizeMutation } from "@/redux/api/sizeApi";

import { useTableFilters } from "@/shared/hooks/use-table-filters";
import EditSize from "./edit-size";
import { sizeColumns } from "./size-columns";

export default function SizeTable() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const categoryId = searchParams.get("id");
    // filter section
    const filters = useTableFilters({ defaultSortBy: "createdAt:desc" });

    const [deleteSizeId, setDeleteSizeId] = useState<string | null>(null);
    const [deleteSize, { isLoading: isDeleting }] = useDeleteSizeMutation();

    const {
        data: sizes,
        isLoading,
        isFetching,
    } = useAllSizesQuery(filters.queryParams as Record<string, string>);

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
            <DataTable
                columns={sizeColumns({ handleEdit, handleDelete })}
                data={sizes?.result || []}
                rowKey={(row) => row.id}
                isFetching={isFetching}
                filters={filters}
                meta={sizes?.meta}
                sortByOptions={categorySortOptions}
                placeholder="Search by name"
            />

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
