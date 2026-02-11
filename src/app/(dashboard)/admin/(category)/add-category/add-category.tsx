"use client";
import CategoryForm from "@/components/common/form/category-form";
import { TCategoryFormValues } from "@/form-schema/category-schema";
import {
    useAllCategoryQuery,
    useCreateCategoryMutation,
} from "@/redux/api/productCategoryApi";

import { toast } from "sonner";

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
