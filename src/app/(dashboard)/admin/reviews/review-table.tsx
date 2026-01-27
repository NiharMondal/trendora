"use client";

import TDSheet from "@/components/common/td-sheet";
import { TDTable } from "@/components/common/td-table";
import { useAllReviewQuery } from "@/redux/api/reviewApi";
import { TReview } from "@/types/review.types";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import EditReview from "./edit-review";
import { reviewColumns } from "./review-columns";

export default function ReviewTable() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get("edit");

    const { data: reviews } = useAllReviewQuery({
        limit: "10",
        sortBy: "createdAt",
        orderBy: "desc",
    });

    const handleAction = (review: TReview) => {
        router.push(`?edit=${review.id}`, { scroll: false });
    };

    const handleCloseDrawer = () => {
        router.push("?", { scroll: false });
    };

    return (
        <React.Fragment>
            <div className="bg-white rounded-md p-5">
                <TDTable
                    columns={reviewColumns(handleAction)}
                    data={reviews?.result || []}
                    rowKey={(row) => row.id}
                />
            </div>

            <TDSheet
                isOpen={!!editId}
                setIsOpen={(open) => !open && handleCloseDrawer()}
                title="Edit Review"
            >
                <EditReview onClose={handleCloseDrawer} />
            </TDSheet>
        </React.Fragment>
    );
}
