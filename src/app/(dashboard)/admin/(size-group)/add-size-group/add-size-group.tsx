"use client";
import SizeGroupForm from "@/components/common/form/size-group-form/size-group-form";
import { TSizeGroupFormValues } from "@/components/common/form/size-group-form/size-group-schema";
import { useCreateSizeGroupMutation } from "@/redux/api/sizeGroupApi";

import { toast } from "sonner";

export default function AddSizeGroup() {
	const [addSizeGroup, { isLoading }] = useCreateSizeGroupMutation();

	const onSubmit = async (values: TSizeGroupFormValues) => {
		try {
			await addSizeGroup(values).unwrap();
			toast.success("Size group created successfully");
		} catch (error: any) {
			toast.error(error.data?.message);
		}
	};
	return <SizeGroupForm onSubmit={onSubmit} isSubmitting={isLoading} />;
}
