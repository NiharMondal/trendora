import BrandForm from "@/components/common/form/brand-form/brand-form";
import { TBrandFormValues } from "@/components/common/form/brand-form/brand-form-schema";
import SpinnerLoading from "@/components/common/spinner-loading";
import {
	useBrandByIdQuery,
	useUpdateBrandMutation,
} from "@/redux/api/brandApi";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { toast } from "sonner";

type EditBrandProps = {
	onClose: () => void;
};

export default function EditBrand({ onClose }: EditBrandProps) {
	const searchParams = useSearchParams();
	const brandId = searchParams.get("id");
	const { data: selectedBrand, isLoading } = useBrandByIdQuery(brandId!, {
		skip: !brandId,
	});
	const [updateBrand, { isLoading: isUpdating }] = useUpdateBrandMutation();

	const defaultValues = useMemo(
		() => ({
			name: selectedBrand?.result?.name,
			logo: selectedBrand?.result?.logo,
		}),
		[selectedBrand],
	);

	const handleUpdateBrand = async (values: TBrandFormValues) => {
		if (!brandId) return;
		try {
			await updateBrand({
				payload: values,
				id: brandId,
			}).unwrap();
			toast.success("Brand updated successfully");
		} catch (error: any) {
			toast.error(error?.data?.message);
		}
	};
	if (!brandId) return null;
	if (isLoading) return <SpinnerLoading />;
	return (
		<div>
			<BrandForm
				defaultValues={defaultValues as TBrandFormValues}
				onSubmit={handleUpdateBrand}
				isSubmitting={isUpdating}
				onSuccess={onClose}
			/>
		</div>
	);
}
