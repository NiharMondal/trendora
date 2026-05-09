"use client";

import {
    reviewSchema,
    TReviewFormValues,
} from "@/components/common/form/review-form/review-schema";
import TDButton from "@/components/common/shared/td-button";
import TDRating from "@/components/form-input/TDRating";
import TDTextArea from "@/components/form-input/TDTextArea";
import { Form } from "@/components/ui/form";
import { useCreateReviewMutation } from "@/redux/api/reviewApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
        // try {
        //     await createReview({ ...data, productId }).unwrap();
        //     toast.success("Review added successfully");
        // } catch (error: any) {
        //     toast.error(error.data.message);
        // }
        console.log(data);
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
