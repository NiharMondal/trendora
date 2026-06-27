import { Edit, EllipsisVertical, Trash } from "lucide-react";

import { DataTableColumn } from "@/components/common/shared/table/table-types";
import TDPopover from "@/components/common/shared/td-popover";
import { TBrand } from "@/components/types/brand.types";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format-date-time";

type Props = {
    handleEdit: (category: TBrand) => void;
    handleDelete: (category: TBrand) => void;
};
export const brandColumns = ({
    handleEdit,
    handleDelete,
}: Props): DataTableColumn<TBrand>[] => [
    {
        key: "name",
        header: "Brand Name",
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
                        <Button variant="ghost" size="icon">
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
