"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { DataTable, TableLoading } from "@/shared/components/table";
import TDButton from "@/shared/components/td-button";
import TDSheet from "@/shared/components/td-sheet";
import { categorySortOptions } from "@/shared/constants/sort-options";
import { TDModal } from "@/shared/components/td-modal";
import { TSizeGroup } from "@/components/types/size-group.types";
import { Button } from "@/shared/ui/button";
import {
    useAllSizeGroupsQuery,
    useDeleteSizeGroupMutation,
} from "@/redux/api/sizeGroupApi";

import { useTableFilters } from "@/shared/hooks/use-table-filters";
import EditSizeGroup from "./edit-size-group";
import { sizeGroupColumns } from "./size-group-columns";

export default function CategoryTable() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const sizeGroupId = searchParams.get("id");
    // filter section
    const filters = useTableFilters({ defaultSortBy: "createdAt:desc" });

    const [deleteSizeGroupId, setDeleteSizeGroupId] = useState<string | null>(
        null,
    );
    const [deleteSizeGroup, { isLoading: isDeleting }] =
        useDeleteSizeGroupMutation();
    const {
        data: sizeGroups,
        isLoading,
        isFetching,
    } = useAllSizeGroupsQuery(filters.queryParams as Record<string, string>);

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
            <DataTable
                columns={sizeGroupColumns({ handleEdit, handleDelete })}
                data={sizeGroups?.result || []}
                rowKey={(row) => row.id}
                isFetching={isFetching}
                filters={filters}
                meta={sizeGroups?.meta}
                sortByOptions={categorySortOptions}
                placeholder="Search by name"
            />

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
