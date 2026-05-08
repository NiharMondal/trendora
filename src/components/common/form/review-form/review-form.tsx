import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import TDInput from "@/components/form-input/TDInput";
import TDTextArea from "@/components/form-input/TDTextArea";
import { Form } from "@/components/ui/form";

import TDRating from "@/components/form-input/TDRating";
import TDButton from "../../shared/td-button";
import { reviewSchema, TReviewFormValues } from "./review-schema";

type AddEditReviewFormProps = {
    defaultValues?: TReviewFormValues | undefined;
    onSubmit: (values: TReviewFormValues) => Promise<void> | void;
    isSubmitting?: boolean;
    userName?: string;
    readonly?: boolean;
    onSuccess?: () => void;
    readOnlyFields?: {
        [key in keyof TReviewFormValues]?: boolean;
    };
};
export default function ReviewForm({
    defaultValues,
    onSubmit,
    isSubmitting,
    readOnlyFields,
    userName,
    onSuccess,
}: AddEditReviewFormProps) {
    const hookForm = useForm({
        resolver: zodResolver(reviewSchema),
        defaultValues: defaultValues ?? {
            rating: 0,
            comment: "",
        },
    });

    const handleReviewSubmit = (values: TReviewFormValues) => {
        onSubmit(values);
        onSuccess?.();
    };
    return (
        <Form {...hookForm}>
            <form
                onSubmit={hookForm.handleSubmit(handleReviewSubmit)}
                className="space-y-1.5"
            >
                {userName && (
                    <TDInput
                        form={hookForm}
                        name="user"
                        label="User Name"
                        disabled={readOnlyFields?.user}
                    />
                )}

                <TDRating form={hookForm} name="rating" label="Your Rating:" />
                <TDTextArea
                    form={hookForm}
                    name="comment"
                    label="Comment"
                    placeholder="Share your thoughts and experiences..."
                />

                <TDButton
                    type="submit"
                    isLoading={isSubmitting}
                    className="px-5"
                >
                    {defaultValues ? "Update Review" : "Add Review"}
                </TDButton>
            </form>
        </Form>
    );
}
