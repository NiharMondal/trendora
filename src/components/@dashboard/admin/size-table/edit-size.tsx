import SizeForm from "@/components/common/form/size-form/size-form";
import { TSizeFormValues } from "@/components/common/form/size-form/size-form-schema";
import SpinnerLoading from "@/components/common/spinner-loading";
import { useSizeByIdQuery, useUpdateSizeMutation } from "@/redux/api/size";
import { TCategory } from "@/types/category.types";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { toast } from "sonner";
type EditSizeProps = {
	onClose: () => void;
};
export default function EditSize({
	onClose,
}: EditSizeProps) {
	const searchParams = useSearchParams();
	const sizeId = searchParams.get("id");
	const { data: selectedSize, isLoading } = useSizeByIdQuery(sizeId!, {
		skip: !sizeId,
	});
	const [updateSize, { isLoading: isUpdating }] = useUpdateSizeMutation();

	const defaultValues = useMemo(
		() => ({
			name: selectedSize?.result?.name,
			sizeGroupId: selectedSize?.result?.sizeGroupId || "",
		}),
		[selectedSize],
	);

	const handleUpdateSize = async (values: TSizeFormValues) => {
		if (!sizeId) return;
		try {
			await updateSize({
				payload: values,
				id: sizeId,
			}).unwrap();
			toast.success("Size updated successfully");
		} catch (error: any) {
			toast.error(error?.data?.message);
		}
	};
	if (!sizeId) return null;
	if (isLoading) return <SpinnerLoading />;
	return (
		<div>
			<SizeForm
				defaultValues={defaultValues as TSizeFormValues}
				onSubmit={handleUpdateSize}
				isSubmitting={isUpdating}
				onSuccess={onClose}
			/>
		</div>
	);
}
