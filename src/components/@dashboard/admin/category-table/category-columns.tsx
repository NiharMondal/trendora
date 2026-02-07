import { Button } from "@/components/ui/button";
import { TCategory } from "@/types/category.types";
import { DataTableColumn } from "@/types/table.types";
import { Trash } from "lucide-react";

export const categoryColumns = (
    onDelete: (id: string) => void,
): DataTableColumn<TCategory>[] => [
    {
        key: "name",
        header: "Category Name",
    },
    {
        key: "parentId",
        header: "Parent Category",
    },
    {
        key: "createdAt",
        header: "Created At",
    },
    {
        key: "updatedAt",
        header: "Updated At",
    },
    {
        key: "actions",
        header: "Actions",
        cell: (row) => {
            const category = row;
            return (
                <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() => onDelete(category.id)}
                >
                    <Trash />
                </Button>
            );
        },
    },
];
