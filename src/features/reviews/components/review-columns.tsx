import { Edit } from "lucide-react";
import moment from "moment";

import { DataTableColumn } from "@/shared/components/table/table-types";
import { TReview } from "@/features/reviews/types/review.types";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import TdUserInfo from "@/shared/components/td-user-info";

export const reviewColumns = (
    handleAction: (review: TReview) => void,
): DataTableColumn<TReview>[] => [
    {
        key: "user",
        header: "User",
        cell: (row) => (
            <TdUserInfo name={row.user.name} avatar={row.user.avatar} />
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
            <Button onClick={() => handleAction(row)} aria-label={`Moderate review by ${row.user.name}`}>
                <Edit />
            </Button>
        ),
    },
];
