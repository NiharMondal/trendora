"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

import {
    DataTable,
    Pagination,
    TableToolbar,
} from "@/components/common/shared/table";
import TableLoading from "@/components/common/shared/table/table-loading";
import TDSheet from "@/components/common/shared/td-sheet";
import { TReview } from "@/components/types/review.types";
import { useAllReviewQuery } from "@/redux/api/reviewApi";

import { reviewSortOptions } from "@/components/helpers/sort-options";
import { useTableFilters } from "@/hooks/use-table-filters";
import EditReview from "./edit-review";
import { reviewColumns } from "./review-columns";

export default function ReviewTable() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const reviewId = searchParams.get("reviewId");
    // filter section
    const {
        currentPage,
        limit,
        search,
        sortBy,
        queryParams,
        setCurrentPage,
        setSearch,
        setSortBy,
        handleLimitChange,
        handleResetFilters,
    } = useTableFilters({ defaultSortBy: "createdAt:desc" });

    const {
        data: reviews,
        isLoading,
        isFetching,
    } = useAllReviewQuery(queryParams as Record<string, string>);

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
                <TableToolbar
                    search={search}
                    limit={limit}
                    sortBy={sortBy}
                    setLimit={handleLimitChange}
                    setSortBy={setSortBy}
                    setSearch={setSearch}
                    sortByOptions={reviewSortOptions}
                    onReset={handleResetFilters}
                    placeholder="Search by review name..."
                />

                <DataTable
                    columns={reviewColumns(handleAction)}
                    data={reviews?.result || []}
                    rowKey={(row) => row.id}
                    isFetching={isFetching}
                />

                {reviews?.meta?.totalPages && reviews?.meta?.totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                        totalPages={reviews?.meta?.totalPages}
                        hasNextPage={reviews?.meta?.hasNextPage}
                        hasPreviousPage={reviews?.meta?.hasPreviousPage}
                        limit={Number(limit)}
                        totalData={reviews?.meta?.totalData || 0}
                    />
                )}
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
