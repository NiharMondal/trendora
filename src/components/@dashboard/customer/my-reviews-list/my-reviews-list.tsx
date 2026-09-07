"use client";

import { useState } from "react";
import { toast } from "sonner";

import ReviewForm from "@/components/common/form/review-form/review-form";
import { TReviewFormValues } from "@/components/common/form/review-form/review-schema";
import { DataTable, TableLoading } from "@/shared/components/table";
import NoDataFound from "@/shared/components/no-data-found";
import TDButton from "@/shared/components/td-button";
import TDSheet from "@/shared/components/td-sheet";
import { TDModal } from "@/shared/components/td-modal";
import { TReview } from "@/components/types/review.types";
import { Button } from "@/shared/ui/button";
import {
	useDeleteReviewMutation,
	useGetMyReviewsQuery,
	useUpdateReviewMutation,
} from "@/redux/api/reviewApi";

import { myReviewColumns } from "./my-reviews-columns";

export default function MyReviewsList() {
	const { data: reviews, isLoading, isFetching } = useGetMyReviewsQuery();

	const [editReview, setEditReview] = useState<TReview | null>(null);
	const [deleteReview, setDeleteReview] = useState<TReview | null>(null);

	const [updateReview, { isLoading: isUpdating }] = useUpdateReviewMutation();
	const [removeReview, { isLoading: isDeleting }] = useDeleteReviewMutation();

	const reviewList = reviews?.result ?? [];

	const handleEdit = (review: TReview) => setEditReview(review);
	const handleDelete = (review: TReview) => setDeleteReview(review);

	const handleUpdate = async (values: TReviewFormValues) => {
		if (!editReview) return;
		try {
			await updateReview({
				payload: {
					rating: Number(values.rating),
					comment: values.comment,
				},
				id: editReview.id,
			}).unwrap();
			toast.success("Review updated successfully");
			setEditReview(null);
		} catch (error: any) {
			toast.error(error?.data?.message ?? "Failed to update review");
		}
	};

	const confirmDelete = async () => {
		if (!deleteReview) return;
		try {
			await removeReview(deleteReview.id).unwrap();
			toast.success("Review deleted successfully");
			setDeleteReview(null);
		} catch (error: any) {
			toast.error(error?.data?.message ?? "Failed to delete review");
		}
	};

	if (isLoading) return <TableLoading />;

	if (reviewList.length === 0) {
		return (
			<NoDataFound
				title="No reviews yet"
				description="You haven't reviewed any products yet. Share your thoughts on products you've purchased."
			/>
		);
	}

	return (
		<div className="space-y-4">
			<p className="text-sm text-gray-500">
				{reviewList.length} review{reviewList.length !== 1 ? "s" : ""}
			</p>

			<DataTable<TReview>
				data={reviewList}
				rowKey={(row) => row.id}
				columns={myReviewColumns({ handleEdit, handleDelete })}
				isFetching={isFetching}
			/>

			<TDSheet
				isOpen={!!editReview}
				setIsOpen={(open) => !open && setEditReview(null)}
				title="Edit Review"
			>
				{editReview && (
					<ReviewForm
						defaultValues={{
							rating: Number(editReview.rating),
							comment: editReview.comment,
						}}
						onSubmit={handleUpdate}
						isSubmitting={isUpdating}
					/>
				)}
			</TDSheet>

			<TDModal
				open={!!deleteReview}
				onOpenChange={(open) => !open && setDeleteReview(null)}
				title="Are you sure you want to delete this review?"
				description="This action cannot be undone."
			>
				<div className="flex justify-end gap-2 mt-4">
					<Button
						variant="outline"
						onClick={() => setDeleteReview(null)}
					>
						Cancel
					</Button>
					<TDButton
						variant="destructive"
						onClick={confirmDelete}
						disabled={isDeleting}
					>
						{isDeleting ? "Deleting..." : "Delete"}
					</TDButton>
				</div>
			</TDModal>
		</div>
	);
}
