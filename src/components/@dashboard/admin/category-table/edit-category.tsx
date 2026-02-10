import CategoryForm from "@/components/common/form/category-form";
import SpinnerLoading from "@/components/common/spinner-loading";
import { TCategoryFormValues } from "@/form-schema/category-schema";
import {
    useCategoryByIdQuery,
    useUpdateCategoryMutation,
} from "@/redux/api/productCategoryApi";
import { TCategory } from "@/types/category.types";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { toast } from "sonner";
type EditCategoryProps = {
    onClose: () => void;
    categories: TCategory[];
};
export default function EditCategory({
    onClose,
    categories = [],
}: EditCategoryProps) {
    const searchParams = useSearchParams();
    const categoryId = searchParams.get("categoryId");
    const { data: selectedCategory, isLoading } = useCategoryByIdQuery(
        categoryId!,
        {
            skip: !categoryId,
        },
    );
    const [updateCategory, { isLoading: isUpdating }] =
        useUpdateCategoryMutation();

    const defaultValues = useMemo(
        () => ({
            name: selectedCategory?.result?.name,
            parentId: selectedCategory?.result?.parentId || "",
        }),
        [selectedCategory],
    );

    const categoryOptions =
        categories?.map((c) => ({
            label: c.name,
            value: c.id,
        })) || [];

    const handleUpdateCategory = async (values: TCategoryFormValues) => {
        if (!categoryId) return;
        try {
            await updateCategory({
                payload: values,
                id: categoryId,
            }).unwrap();
            toast.success("Category updated successfully");
        } catch (error: any) {
            toast.error(error?.data?.message);
        }
    };
    if (!categoryId) return null;
    if (isLoading) return <SpinnerLoading />;
    return (
        <div>
            <CategoryForm
                defaultValues={defaultValues as TCategoryFormValues}
                onSubmit={handleUpdateCategory}
                categories={categoryOptions}
                isSubmitting={isUpdating}
                onSuccess={onClose}
            />
        </div>
    );
}
