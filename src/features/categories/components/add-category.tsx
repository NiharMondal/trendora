"use client";
import { toast } from "sonner";

import CategoryForm from "@/features/categories/components/category-form";
import { TCategoryFormValues } from "@/features/categories/schemas/category-form.schema";
import {
    useAllCategoryQuery,
    useCreateCategoryMutation,
} from "@/features/categories/api/category.api";

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
        } catch (error: any) {
            toast.error(error.data?.message);
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
