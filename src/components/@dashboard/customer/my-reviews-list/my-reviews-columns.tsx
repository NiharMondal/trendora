import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { ReactSmartRating } from "react-smart-rating";

import { DataTableColumn } from "@/components/common/shared/table/table-types";
import { TReview } from "@/components/types/review.types";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format-date-time";
import { cn } from "@/lib/utils";

type MyReviewColumnActions = {
    handleEdit: (review: TReview) => void;
    handleDelete: (review: TReview) => void;
};

export const myReviewColumns = ({
    handleEdit,
    handleDelete,
}: MyReviewColumnActions): DataTableColumn<TReview>[] => [
    {
        key: "product",
        header: "Product",
        cell: (row) => {
            const image = row.product?.images?.find((img) => img.isMain)
                ?.url ?? row.product?.images?.[0]?.url;

            const content = (
                <div className="flex items-center gap-x-2">
                    <div className="size-14 flex items-center justify-center bg-gray-100 rounded-md overflow-hidden shrink-0">
                        {image ? (
                            <img
                                src={image}
                                alt={row.product?.name ?? "Product"}
                                className="size-full object-cover"
                                loading="lazy"
                            />
                        ) : null}
                    </div>
                    <p className="font-medium line-clamp-2 max-w-[16rem]">
                        {row.product?.name ?? "Product"}
                    </p>
                </div>
            );

            return row.product?.slug ? (
                <Link
                    href={`/products/${row.product.slug}`}
                    className="hover:text-primary"
                >
                    {content}
                </Link>
            ) : (
                content
            );
        },
    },
    {
        key: "rating",
        header: "Rating",
        cell: (row) => (
            <ReactSmartRating
                initialRating={row.rating}
                totalStars={5}
                size={16}
                readOnly
            />
        ),
    },
    {
        key: "comment",
        header: "Comment",
        cell: (row) => (
            <p className={cn("max-w-sm truncate")} title={row.comment}>
                {row.comment || "—"}
            </p>
        ),
    },
    {
        key: "createdAt",
        header: "Reviewed On",
        cell: (row) => (
            <span className="font-medium">{formatDate(row.createdAt, "ll")}</span>
        ),
    },
    {
        key: "actions",
        header: "Actions",
        cell: (row) => (
            <div className="flex items-center gap-x-2">
                <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() => handleEdit(row)}
                    aria-label="Edit review"
                >
                    <Pencil />
                </Button>
                <Button
                    variant="outline"
                    size="icon-sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(row)}
                    aria-label="Delete review"
                >
                    <Trash2 />
                </Button>
            </div>
        ),
    },
];
