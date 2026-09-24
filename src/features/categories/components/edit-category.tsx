import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { toast } from "sonner";

import CategoryForm from "@/features/categories/components/category-form";
import { TCategoryFormValues } from "@/features/categories/schemas/category-form.schema";
import SpinnerLoading from "@/shared/components/loading/spinner-loading";
import { TCategory } from "@/features/categories/types/category.types";
import {
	useCategoryByIdQuery,
	useUpdateCategoryMutation,
} from "@/features/categories/api/category.api";
import QueryError from "@/shared/components/query-error";
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
	const {
	    data: selectedCategory,
	    isLoading,
	    error: loadError,
	    refetch: retryLoad,
	} = useCategoryByIdQuery(
		categoryId!,
		{
			skip: !categoryId,
		},
	);
	const [updateCategory, { isLoading: isUpdating }] =
		useUpdateCategoryMutation();

	const defaultValues = useMemo(() => {
		const category = selectedCategory?.result;

		return {
			name: category?.name,
			sizeGroupId: category?.sizeGroupId || "",
			parentId: category?.parentId || "",
			// Round-trip the existing image. Omitting it sends `undefined`,
			// which the backend reads as "leave it alone" — but the upload
			// widget would then start blank and an admin replacing the picture
			// would have no idea one was already set.
			image:
				category?.image && category?.imagePublicId
					? {
							url: category.image,
							publicId: category.imagePublicId,
						}
					: null,
		};
	}, [selectedCategory]);

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
	if (loadError) {
		return (
			<QueryError
				error={loadError}
				onRetry={retryLoad}
				title="Could not load this category"
			/>
		);
	}
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
