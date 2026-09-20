"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

import { DataTable } from "@/shared/components/table";
import TableLoading from "@/shared/components/table/table-loading";
import TDSheet from "@/shared/components/td-sheet";
import { TReview } from "@/features/reviews/types/review.types";
import { useAllReviewQuery } from "@/features/reviews/api/review.api";

import { reviewSortOptions } from "@/shared/constants/sort-options";
import { useTableFilters } from "@/shared/hooks/use-table-filters";
import EditReview from "./edit-review";
import { reviewColumns } from "./review-columns";

export default function ReviewTable() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const reviewId = searchParams.get("reviewId");
    // filter section
    const filters = useTableFilters({ defaultSortBy: "createdAt:desc" });

    const {
        data: reviews,
        isLoading,
        isFetching,
    } = useAllReviewQuery(filters.queryParams as Record<string, string>);

    const handleAction = (review: TReview) => {
        router.push(`?reviewId=${review.id}`, { scroll: false });
    };

    const handleCloseDrawer = () => {
        router.push("?", { scroll: false });
    };
    if (isLoading) return <TableLoading />;
    return (
        <React.Fragment>
            <div className="space-y-5 bg-white p-5 rounded-md">
                <DataTable
                    columns={reviewColumns(handleAction)}
                    data={reviews?.result || []}
                    rowKey={(row) => row.id}
                    isFetching={isFetching}
                    filters={filters}
                    meta={reviews?.meta}
                    sortByOptions={reviewSortOptions}
                    placeholder="Search by review name..."
                />
            </div>

            <TDSheet
                isOpen={!!reviewId}
                setIsOpen={(open) => !open && handleCloseDrawer()}
                title="Edit Review Form"
            >
                <div className="p-5 border border-muted rounded-md">
                    <EditReview onClose={handleCloseDrawer} />
                </div>
            </TDSheet>
        </React.Fragment>
    );
}
