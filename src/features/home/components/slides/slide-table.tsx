"use client";

import { Eye, GalleryHorizontal, Plus } from "lucide-react";
import Link from "next/link";
import { useUrlParam } from "@/shared/hooks/use-url-param";
import { useState } from "react";
import { toast } from "sonner";

import {
    useAllSlidesForAdminQuery,
    useDeleteSlideMutation,
    useUpdateSlideMutation,
} from "@/features/home/api/slide.api";
import { TSlide } from "@/features/home/types/slide.types";
import { DataTable } from "@/shared/components/table";
import TDButton from "@/shared/components/td-button";
import { TDModal } from "@/shared/components/td-modal";
import TDSheet from "@/shared/components/td-sheet";
import { slideSortOptions } from "@/shared/constants/sort-options";
import { useTableFilters } from "@/shared/hooks/use-table-filters";
import { Button } from "@/shared/ui/button";
import { getApiErrorMessage } from "@/shared/utils/api-error";
import EditSlide from "./edit-slide";
import { slideColumns } from "./slide-columns";

/**
 * Hero-slider management. Reads `GET /slides/admin/all`, not the public
 * `GET /slides`: the public list hard-filters `isActive: true`, so a hidden
 * slide would vanish from the very screen that has to bring it back.
 */
export default function SlideTable() {
    const editParam = useUrlParam("id");
    const editId = editParam.value;

    const filters = useTableFilters({
        defaultSortBy: "sortOrder:asc",
        defaultFilters: { isActive: "" },
    });

    const {
        data: slides,
        isFetching,
        error: listError,
        refetch: refetchList,
    } = useAllSlidesForAdminQuery(filters.queryParams as Record<string, string>);

    const [updateSlide] = useUpdateSlideMutation();
    const [deleteSlide, { isLoading: isDeleting }] = useDeleteSlideMutation();
    const [deleteTarget, setDeleteTarget] = useState<TSlide | null>(null);

    const closeEdit = () => editParam.clear();

    const handleToggleActive = async (slide: TSlide) => {
        try {
            await updateSlide({
                id: slide.id,
                payload: { isActive: !slide.isActive },
            }).unwrap();
            toast.success(
                slide.isActive
                    ? "Slide hidden from the storefront"
                    : "Slide is live on the storefront",
            );
        } catch (error) {
            toast.error(getApiErrorMessage(error));
        }
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        try {
            await deleteSlide(deleteTarget.id).unwrap();
            toast.success("Slide deleted");
            setDeleteTarget(null);
        } catch (error) {
            toast.error(getApiErrorMessage(error));
        }
    };

    return (
        <div className="space-y-5 rounded-md bg-white p-5">
            <DataTable
                title="Hero slides"
                description="The banners at the top of the storefront home page, in display order. Hide a slide to take it down without losing it."
                icon={GalleryHorizontal}
                actions={
                    <Button size="sm" asChild>
                        <Link href="/admin/add-slide">
                            <Plus />
                            Add slide
                        </Link>
                    </Button>
                }
                columns={slideColumns({
                    handleEdit: (slide) =>
                        editParam.set(slide.id),
                    handleToggleActive,
                    handleDelete: setDeleteTarget,
                })}
                data={slides?.result || []}
                rowKey={(row) => row.id}
                isFetching={isFetching}
                error={listError}
                onRetry={refetchList}
                filters={filters}
                meta={slides?.meta}
                sortByOptions={slideSortOptions}
                toolbarFilters={[
                    {
                        key: "isActive",
                        label: "Status",
                        icon: Eye,
                        allLabel: "All slides",
                        options: [
                            { label: "Live", value: "true" },
                            { label: "Hidden", value: "false" },
                        ],
                    },
                ]}
                placeholder="Search title or subtitle..."
                emptyState={{
                    title: "No slides yet",
                    description:
                        "The storefront hero is empty until you add one.",
                }}
            />

            <TDSheet
                isOpen={!!editId}
                setIsOpen={(open) => !open && closeEdit()}
                title="Edit slide"
            >
                {editId ? (
                    <EditSlide slideId={editId} onClose={closeEdit} />
                ) : null}
            </TDSheet>

            <TDModal
                open={!!deleteTarget}
                onOpenChange={(open) => !open && setDeleteTarget(null)}
                title={`Delete "${deleteTarget?.title ?? ""}"?`}
                description="It is removed from the storefront and this list. To take a slide down temporarily, hide it instead."
            >
                <div className="mt-4 flex justify-end gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setDeleteTarget(null)}
                    >
                        Cancel
                    </Button>
                    <TDButton
                        variant="destructive"
                        onClick={confirmDelete}
                        isLoading={isDeleting}
                    >
                        Delete
                    </TDButton>
                </div>
            </TDModal>
        </div>
    );
}
