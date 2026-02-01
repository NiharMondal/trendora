"use client";
import TDButton from "@/components/common/td-button";
import TDInput from "@/components/form-input/TDInput";
import { Form } from "@/components/ui/form";
import {
    categorySchema,
    TCategoryFormValues,
} from "@/form-schema/category-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

type Props = {
    defaultValues?: TCategoryFormValues | undefined;
    onSubmit: (values: TCategoryFormValues) => Promise<void> | void;
    isSubmitting?: boolean;
    onSuccess?: () => void;
    readOnlyFields?: {
        [key in keyof TCategoryFormValues]?: boolean;
    };
};
export default function CategoryForm({
    defaultValues,
    onSubmit,
    isSubmitting,
    readOnlyFields,
    onSuccess,
}: Props) {
    const hookForm = useForm({
        resolver: zodResolver(categorySchema),
        defaultValues: defaultValues ?? {
            name: "",
            parentId: "",
        },
    });

    const handleCategorySubmit = (values: TCategoryFormValues) => {
        onSubmit(values);
        onSuccess?.();
    };
    return (
        <Form {...hookForm}>
            <form
                onSubmit={hookForm.handleSubmit(handleCategorySubmit)}
                className="space-y-1.5 bg-white p-5 rounded-md"
            >
                <TDInput
                    form={hookForm}
                    name="name"
                    label="Category Name"
                    disabled={readOnlyFields?.name}
                />
                <TDInput
                    form={hookForm}
                    name="parentId"
                    label="Parent Category"
                    disabled={readOnlyFields?.parentId}
                />

                <TDButton
                    type="submit"
                    isLoading={isSubmitting}
                    className="px-5"
                >
                    {defaultValues ? "Update Category" : "Add Category"}
                </TDButton>
            </form>
        </Form>
    );
}
