import SizeGroupForm from "@/components/common/form/size-group-form/size-group-form";
import { TSizeGroupFormValues } from "@/components/common/form/size-group-form/size-group-schema";
import SpinnerLoading from "@/components/common/spinner-loading";
import {
	useSizeGroupByIdQuery,
	useUpdateSizeGroupMutation,
} from "@/redux/api/sizeGroupApi";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { toast } from "sonner";

type EditSizeGroupProps = {
	onClose: () => void;
};

export default function EditSizeGroup({ onClose }: EditSizeGroupProps) {
	const searchParams = useSearchParams();
	const sizeGroupId = searchParams.get("id");
	const { data: selectedSizeGroup, isLoading } = useSizeGroupByIdQuery(
		sizeGroupId!,
		{
			skip: !sizeGroupId,
		},
	);
	console.log(selectedSizeGroup);
	const [updateSizeGroup, { isLoading: isUpdating }] =
		useUpdateSizeGroupMutation();

	const defaultValues = useMemo(
		() => ({
			name: selectedSizeGroup?.result?.name,
		}),
		[selectedSizeGroup],
	);

	const handleUpdateSizeGroup = async (values: TSizeGroupFormValues) => {
		if (!sizeGroupId) return;
		try {
			await updateSizeGroup({
				payload: values,
				id: sizeGroupId,
			}).unwrap();
			toast.success("Size group updated successfully");
		} catch (error: any) {
			toast.error(error?.data?.message);
		}
	};
	if (!sizeGroupId) return null;
	if (isLoading) return <SpinnerLoading />;
	return (
		<div>
			<SizeGroupForm
				defaultValues={defaultValues as TSizeGroupFormValues}
				onSubmit={handleUpdateSizeGroup}
				isSubmitting={isUpdating}
				onSuccess={onClose}
			/>
		</div>
	);
}
