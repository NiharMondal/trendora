import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

import ReviewForm from "@/components/common/form/review-form/review-form";
import { TReviewFormValues } from "@/components/common/form/review-form/review-schema";
import SpinnerLoading from "@/components/common/loading/spinner-loading";
import {
    useReviewByIdQuery,
    useUpdateReviewMutation,
} from "@/redux/api/reviewApi";
type EditReviewProps = {
    onClose?: () => void;
};
export default function EditReview({ onClose }: EditReviewProps) {
    const searchParams = useSearchParams();
    const reviewId = searchParams.get("reviewId");
    const [updateReview, { isLoading: isUpdating }] = useUpdateReviewMutation();

    const { data: review, isLoading } = useReviewByIdQuery(reviewId!, {
        skip: !reviewId,
    });

    const defaultValues: TReviewFormValues | undefined = review?.result
        ? {
              user: review.result.user?.name || "",
              rating: review.result.rating,
              comment: review.result.comment,
          }
        : undefined;

    const handleReviewSubmit = async (values: TReviewFormValues) => {
        try {
            await updateReview({
                payload: values,
                id: review?.result?.id || reviewId!,
            }).unwrap();
            toast.success("Review updated successfully");
        } catch (error) {
            toast.error("Failed to update review");
        }
    };

    if (!reviewId) return null;
    if (isLoading) return <SpinnerLoading />;
    return (
        <ReviewForm
            defaultValues={defaultValues}
            onSubmit={handleReviewSubmit}
            isSubmitting={isUpdating}
            userName={review?.result.user?.name}
            onSuccess={onClose}
            readOnlyFields={{
                user: true,
            }}
        />
    );
}
