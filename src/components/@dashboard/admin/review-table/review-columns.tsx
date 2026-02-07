import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TReview } from "@/types/review.types";
import { DataTableColumn } from "@/types/table.types";
import { Edit } from "lucide-react";
import moment from "moment";

export const reviewColumns = (
    handleAction: (review: TReview) => void,
): DataTableColumn<TReview>[] => [
    {
        key: "user",
        header: "User",
        cell: (row) => (
            <div className="flex items-center gap-x-2">
                <div className="size-16 flex items-center justify-center bg-gray-100 rounded-md">
                    <img
                        src={row.user.avatar}
                        alt="User Avatar"
                        className="size-full rounded-md"
                    />
                </div>
                <p className="font-medium">{row.user.name}</p>
            </div>
        ),
    },
    {
        key: "rating",
        header: "Rating",
    },
    {
        key: "comment",
        header: "Comment",
        cell: (row) => {
            return (
                <p className={cn("max-w-sm truncate")} title={row.comment}>
                    {row.comment}
                </p>
            );
        },
    },
    {
        key: "createdAt",
        header: "Created At",
        cell: (row) => (
            <span className={cn("font-medium")}>
                {moment(row.createdAt).format("LL")}
            </span>
        ),
    },
    {
        key: "actions",
        header: "Actions",
        cell: (row) => (
            <Button onClick={() => handleAction(row)}>
                <Edit />
            </Button>
        ),
    },
];
