import AddEditReviewForm from "@/components/common/add-edit-review-form";
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
    const reviewId = searchParams.get("edit");
    const [updateReview, { isLoading }] = useUpdateReviewMutation();

    const { data: review, isLoading: getLoading } = useReviewByIdQuery(
        reviewId!,
        {
            skip: !reviewId,
        },
    );

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
                id: review?.result?.id || "",
            }).unwrap();
            toast.success("Review updated successfully");
        } catch (error) {
            toast.error("Failed to update review");
        }
    };

    if (!reviewId) return null;
    if (getLoading) return <p>Loading...</p>;
    return (
        <AddEditReviewForm
            defaultValues={defaultValues}
            onSubmit={handleReviewSubmit}
            isSubmitting={isLoading}
            userName={review?.result.user?.name}
            onSuccess={onClose}
            readOnlyFields={{
                user: true,
            }}
        />
    );
}
