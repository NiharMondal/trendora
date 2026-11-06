"use client";

import {
    reviewSchema,
    TReviewFormValues,
} from "@/features/reviews/schemas/review-form.schema";
import TDButton from "@/shared/components/td-button";
import TDRating from "@/shared/form/TDRating";
import TDTextArea from "@/shared/form/TDTextArea";
import { Form } from "@/shared/ui/form";
import { useCreateReviewMutation } from "@/features/reviews/api/review.api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/shared/utils/api-error";

type WriteReviewProps = {
    productId: string;
};

export default function WriteReview({ productId }: WriteReviewProps) {
    const hookForm = useForm<TReviewFormValues>({
        resolver: zodResolver(reviewSchema),
        defaultValues: {
            rating: 0,
            comment: "",
            productId: productId || "",
        },
    });

    const [createReview, { isLoading }] = useCreateReviewMutation();

    const onSubmit = async (data: TReviewFormValues) => {
        // An empty comment means "rating only" — send no comment at all rather
        // than `""`, which the backend used to reject (XR-04).
        const comment = data.comment?.trim();
        try {
            await createReview({
                rating: data.rating,
                productId,
                ...(comment ? { comment } : {}),
            }).unwrap();
            toast.success("Review added successfully");
            hookForm.reset({ rating: 0, comment: "", productId });
        } catch (error) {
            // Was `error.data.message` with no optional chaining, so a network
            // failure threw inside the catch block.
            toast.error(getApiErrorMessage(error, "Could not post your review"));
        }
    };

    return (
        <Form {...hookForm}>
            <form
                onSubmit={hookForm.handleSubmit(onSubmit)}
                className="flex h-full flex-col gap-4 rounded-lg border border-muted bg-card/50 p-6"
            >
                <div>
                    <h3 className="text-lg font-semibold">Write a review</h3>
                    <p className="text-sm text-muted-foreground">
                        Share your experience with other shoppers.
                    </p>
                </div>

                <TDRating form={hookForm} name="rating" label="Your Rating:" />

                <TDTextArea
                    form={hookForm}
                    name="comment"
                    placeholder="Tell others what you liked or didn't like..."
                />

                <div className="flex justify-end">
                    <TDButton
                        type="submit"
                        isLoading={isLoading}
                        className="px-6"
                    >
                        Submit Review
                    </TDButton>
                </div>
            </form>
        </Form>
    );
}
