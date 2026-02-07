"use client";
import { TCategoryFormValues } from "@/form-schema/category-schema";
import CategoryForm from "@/form/category-form";
import { useCreateCategoryMutation } from "@/redux/api/productCategoryApi";

import { toast } from "sonner";

export default function AddCategory() {
    const [addCategory, { isLoading }] = useCreateCategoryMutation();
    const onSubmit = async (values: TCategoryFormValues) => {
        try {
            await addCategory(values).unwrap();
            toast.success("Category added successfully");
        } catch (error: any) {
            toast.error(error.data?.message);
        }
    };
    return <CategoryForm onSubmit={onSubmit} isSubmitting={isLoading} />;
}
