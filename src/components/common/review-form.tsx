import { TReviewFormData, reviewSchema } from "@/form-schema/review-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import TDInput from "../form-input/TDInput";
import TDTextArea from "../form-input/TDTextArea";
import { Form } from "../ui/form";
import TDButton from "./td-button";

type AddEditReviewFormProps = {
    defaultValues?: TReviewFormData | undefined;
    onSubmit: (values: TReviewFormData) => Promise<void> | void;
    isSubmitting?: boolean;
    userName?: string;
    readonly?: boolean;
    onSuccess?: () => void;
    readOnlyFields?: {
        [key in keyof TReviewFormData]?: boolean;
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

    const handleReviewSubmit = (values: TReviewFormData) => {
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

                <TDInput
                    form={hookForm}
                    name="rating"
                    label="Rating"
                    type="number"
                />
                <TDTextArea form={hookForm} name="comment" label="Comment" />

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
