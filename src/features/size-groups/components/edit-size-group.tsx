import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { toast } from "sonner";

import SizeGroupForm from "@/features/size-groups/components/size-group-form";
import { TSizeGroupFormValues } from "@/features/size-groups/schemas/size-group-form.schema";
import SpinnerLoading from "@/shared/components/loading/spinner-loading";
import {
	useSizeGroupByIdQuery,
	useUpdateSizeGroupMutation,
} from "@/features/size-groups/api/size-group.api";
import QueryError from "@/shared/components/query-error";
import { getApiErrorMessage } from "@/shared/utils/api-error";

type EditSizeGroupProps = {
	onClose: () => void;
};

export default function EditSizeGroup({ onClose }: EditSizeGroupProps) {
	const searchParams = useSearchParams();
	const sizeGroupId = searchParams.get("id");
	const {
	    data: selectedSizeGroup,
	    isLoading,
	    error: loadError,
	    refetch: retryLoad,
	} = useSizeGroupByIdQuery(
		sizeGroupId!,
		{
			skip: !sizeGroupId,
		},
	);
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
		} catch (error) {
			toast.error(getApiErrorMessage(error));
		}
	};
	if (!sizeGroupId) return null;
	if (isLoading) return <SpinnerLoading />;
	if (loadError) {
		return (
			<QueryError
				error={loadError}
				onRetry={retryLoad}
				title="Could not load this size group"
			/>
		);
	}
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
