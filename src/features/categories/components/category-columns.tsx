import { Edit, EllipsisVertical, ImageOff, Trash } from "lucide-react";

import { DataTableColumn } from "@/shared/components/table/table-types";
import TDPopover from "@/shared/components/td-popover";
import { TCategory } from "@/features/categories/types/category.types";
import { Button } from "@/shared/ui/button";
import { formatDate } from "@/shared/lib/format-date-time";
import Image from "next/image";

type Props = {
    handleEdit: (category: TCategory) => void;
    handleDelete: (category: TCategory) => void;
};
export const categoryColumns = ({
    handleEdit,
    handleDelete,
}: Props): DataTableColumn<TCategory>[] => [
    {
        key: "image",
        header: "Store Front Image",
        cell: (row) => (
            // The image is optional, so render <Image> only when there is one:
            // an empty `src` makes the browser re-request the page.
            <div className="relative flex h-10 w-20 items-center justify-center overflow-hidden rounded bg-muted">
                {row.image ? (
                    <Image
                        src={row.image}
                        alt={row.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                    />
                ) : (
                    <ImageOff
                        className="size-4 text-muted-foreground"
                        aria-label="No image"
                    />
                )}
            </div>
        ),
    },
    {
        key: "name",
        header: "Category Name",
    },
    {
        key: "sizeGroupId",
        header: "Size Group",
        cell: (row) => {
            const category = row;
            return <span>{category.sizeGroup?.name ?? "N/A"}</span>;
        },
    },
    {
        key: "parent",
        header: "Parent Category",
        cell: (row) => {
            const category = row;
            return <span>{category.parent?.name ?? "N/A"}</span>;
        },
    },
    {
        key: "createdAt",
        header: "Created At",
        cell: (row) => {
            const category = row;
            return <span>{formatDate(category.createdAt, "ll")}</span>;
        },
    },
    {
        key: "updatedAt",
        header: "Updated At",
        cell: (row) => {
            const category = row;
            return <span>{formatDate(category.updatedAt, "ll")}</span>;
        },
    },
    {
        key: "actions",
        header: "Actions",
        cell: (row) => {
            const category = row;
            return (
                <TDPopover
                    trigger={
                        <Button variant="ghost" size="icon" aria-label={`Actions for ${row.name}`}>
                            <EllipsisVertical />
                        </Button>
                    }
                    className="max-w-[150px]"
                >
                    <div className="flex flex-col gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(category)}
                        >
                            <Edit />
                            Edit
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(category)}
                        >
                            <Trash />
                            Delete
                        </Button>
                    </div>
                </TDPopover>
            );
        },
    },
];
