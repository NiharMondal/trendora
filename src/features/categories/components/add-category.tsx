"use client";
import { toast } from "sonner";

import CategoryForm from "@/features/categories/components/category-form";
import { TCategoryFormValues } from "@/features/categories/schemas/category-form.schema";
import {
    useAllCategoryQuery,
    useCreateCategoryMutation,
} from "@/features/categories/api/category.api";
import { getApiErrorMessage } from "@/shared/utils/api-error";

export default function AddCategory() {
    const [addCategory, { isLoading }] = useCreateCategoryMutation();
    const { data: categories } = useAllCategoryQuery({});

    const categoryOptions =
        categories?.result?.map((c) => ({
            label: c.name,
            value: c.id,
        })) || [];

    const onSubmit = async (values: TCategoryFormValues) => {
        try {
            await addCategory(values).unwrap();
            toast.success("Category added successfully");
            return true;
        } catch (error) {
            toast.error(getApiErrorMessage(error));
            return false;
        }
    };
    return (
        <CategoryForm
            onSubmit={onSubmit}
            isSubmitting={isLoading}
            categories={categoryOptions}
        />
    );
}
