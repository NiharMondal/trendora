"use client";

import NoDataFound from "@/components/common/shared/no-data-found";
import TableLoading from "@/components/common/shared/table/table-loading";
import TDSheet from "@/components/common/td-sheet";
import { DataTable } from "@/components/common/td-table";
import { TReview } from "@/components/types/review.types";
import { useAllReviewQuery } from "@/redux/api/reviewApi";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import EditReview from "./edit-review";
import { reviewColumns } from "./review-columns";

export default function ReviewTable() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const reviewId = searchParams.get("reviewId");

	const { data: reviews, isLoading } = useAllReviewQuery({
		limit: "10",
		sortBy: "createdAt",
		orderBy: "desc",
	});

	const handleAction = (review: TReview) => {
		router.push(`?reviewId=${review.id}`, { scroll: false });
	};

	const handleCloseDrawer = () => {
		router.push("?", { scroll: false });
	};
	if (isLoading) return <TableLoading />;
	return (
		<React.Fragment>
			<div className="bg-white rounded-md p-5">
				{reviews?.result?.length === 0 ? (
					<NoDataFound />
				) : (
					<DataTable
						columns={reviewColumns(handleAction)}
						data={reviews?.result || []}
						rowKey={(row) => row.id}
						isFetching={isLoading}
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
