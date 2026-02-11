import ReviewForm from "@/components/common/review-form";
import SpinnerLoading from "@/components/common/spinner-loading";
import { TReviewFormData } from "@/form-schema/review-schema";
import {
    useReviewByIdQuery,
    useUpdateReviewMutation,
} from "@/redux/api/reviewApi";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
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

    const defaultValues: TReviewFormData | undefined = review?.result
        ? {
              user: review.result.user?.name || "",
              rating: review.result.rating,
              comment: review.result.comment,
          }
        : undefined;

    const handleReviewSubmit = async (values: TReviewFormData) => {
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
