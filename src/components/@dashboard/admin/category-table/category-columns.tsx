import { Button } from "@/components/ui/button";
import TDPopover from "@/shared/td-popover";
import { TCategory } from "@/types/category.types";
import { DataTableColumn } from "@/types/table.types";
import { Edit, EllipsisVertical, Trash } from "lucide-react";
import moment from "moment";

type Props = {
    handleEdit: (category: TCategory) => void;
    handleDelete: (category: TCategory) => void;    
};
export const categoryColumns = ({
    handleEdit,
    handleDelete,
}: Props): DataTableColumn<TCategory>[] => [
    {
        key: "name",
        header: "Category Name",
    },
    {
        key: "parent",
        header: "Parent Category",
        cell: (row) => {
            const category = row;
            return <span>{category.parent?.name || "N/A"}</span>;
        },
    },
    {
        key: "createdAt",
        header: "Created At",
        cell: (row) => {
            const category = row;
            return <span>{moment(category.createdAt).format("LL")}</span>;
        },
    },
    {
        key: "updatedAt",
        header: "Updated At",
        cell: (row) => {
            const category = row;
            return <span>{moment(category.updatedAt).format("LL")}</span>;
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
