"use client";
import { useRouter } from "next/navigation";
import { useUrlParam } from "@/shared/hooks/use-url-param";
import { ComponentType, useState } from "react";
import { toast } from "sonner";

import { DataTable, TableLoading } from "@/shared/components/table";
import TDButton from "@/shared/components/td-button";
import TDSheet from "@/shared/components/td-sheet";
import { categorySortOptions } from "@/shared/constants/sort-options";
import { TDModal } from "@/shared/components/td-modal";
import { TSizeGroup } from "@/features/size-groups/types/size-group.types";
import { Button } from "@/shared/ui/button";
import {
    useAllSizeGroupsQuery,
    useDeleteSizeGroupMutation,
} from "@/features/size-groups/api/size-group.api";

import { useTableFilters } from "@/shared/hooks/use-table-filters";
import EditSizeGroup from "./edit-size-group";
import { sizeGroupColumns } from "./size-group-columns";
import { PackageIcon, PlusIcon } from "lucide-react";
import { getApiErrorMessage } from "@/shared/utils/api-error";

export default function CategoryTable() {
    const router = useRouter();
    const editParam = useUrlParam("id");
    const sizeGroupId = editParam.value;
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
        error: listError,
        refetch: refetchList,
    } = useAllSizeGroupsQuery(filters.queryParams as Record<string, string>);

    const handleEdit = (sizeGroup: TSizeGroup) => {
        editParam.set(sizeGroup.id);
    };
    const handleCloseDrawer = () => {
        editParam.clear();
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
        } catch (error) {
            toast.error(getApiErrorMessage(error));
        }
    };
    if (isLoading) return <TableLoading />;
    return (
        <div className="space-y-5 bg-white p-5 rounded-md">
            <DataTable
                columns={sizeGroupColumns({ handleEdit, handleDelete })}
                data={sizeGroups?.result || []}
                rowKey={(row) => row.id}
                error={listError}
                onRetry={refetchList}
                isFetching={isFetching}
                filters={filters}
                meta={sizeGroups?.meta}
                sortByOptions={categorySortOptions}
                placeholder="Search by name"
                title="Size Groups"
                description="Manage your size groups"
                icon={PackageIcon as ComponentType<{ className?: string }>}
                actions={
                    <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={() => router.push("/admin/add-size-group")}>
                            <PlusIcon className="size-4" />
                            Add Size Group
                        </Button>
                    </div>
                }
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
