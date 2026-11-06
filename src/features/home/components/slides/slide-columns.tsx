import { Edit, EllipsisVertical, Eye, EyeOff, Trash } from "lucide-react";

import { DataTableColumn } from "@/shared/components/table/table-types";
import TDPopover from "@/shared/components/td-popover";
import { formatDate } from "@/shared/lib/format-date-time";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { TSlide } from "@/features/home/types/slide.types";

type Props = {
    handleEdit: (slide: TSlide) => void;
    handleToggleActive: (slide: TSlide) => void;
    handleDelete: (slide: TSlide) => void;
};

export const slideColumns = ({
    handleEdit,
    handleToggleActive,
    handleDelete,
}: Props): DataTableColumn<TSlide>[] => [
    {
        key: "sortOrder",
        header: "Order",
        width: "w-16",
        align: "center",
    },
    {
        key: "title",
        header: "Slide",
        cell: (row) => (
            <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element -- slide art can be hosted anywhere */}
                <img
                    src={row.photoUrl}
                    alt={row.title}
                    className="h-12 w-20 shrink-0 rounded-md object-cover"
                    loading="lazy"
                />
                <div className="min-w-0 space-y-0.5">
                    <p className="font-semibold">{row.title}</p>
                    <p className="line-clamp-1 text-sm text-muted-foreground">
                        {row.subtitle}
                    </p>
                </div>
            </div>
        ),
    },
    {
        key: "url",
        header: "Link",
        cell: (row) => <code className="text-xs">{row.url}</code>,
    },
    {
        key: "isActive",
        header: "Status",
        cell: (row) => (
            <span
                className={cn(
                    "rounded-full px-2.5 py-1 text-xs font-semibold",
                    row.isActive
                        ? "bg-success-100 text-success-700"
                        : "bg-muted text-muted-foreground",
                )}
            >
                {row.isActive ? "Live" : "Hidden"}
            </span>
        ),
    },
    {
        key: "updatedAt",
        header: "Updated",
        cell: (row) => <span>{formatDate(row.updatedAt, "ll")}</span>,
    },
    {
        key: "actions",
        header: "Actions",
        cell: (row) => (
            <TDPopover
                trigger={
                    <Button variant="ghost" size="icon" aria-label="Slide actions">
                        <EllipsisVertical />
                    </Button>
                }
                className="max-w-[170px]"
            >
                <div className="flex flex-col gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(row)}
                    >
                        <Edit />
                        Edit
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleActive(row)}
                    >
                        {row.isActive ? <EyeOff /> : <Eye />}
                        {row.isActive ? "Hide" : "Show"}
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(row)}
                    >
                        <Trash />
                        Delete
                    </Button>
                </div>
            </TDPopover>
        ),
    },
];
