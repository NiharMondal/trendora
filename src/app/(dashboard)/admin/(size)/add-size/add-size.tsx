"use client";
import SizeForm from "@/components/common/form/size-form/size-form";
import { TSizeFormValues } from "@/components/common/form/size-form/size-form-schema";
import { useCreateSizeMutation } from "@/redux/api/size";
import { toast } from "sonner";

export default function AddSize() {
	const [createSize, { isLoading }] = useCreateSizeMutation();

	const handleSubmit = async (values: TSizeFormValues) => {
		try {
			await createSize(values).unwrap();
			toast.success("Size created successfully!");
		} catch (error: any) {
			toast.error(error?.data?.message || "Failed to create size.");
		}
	};
	return <SizeForm onSubmit={handleSubmit} isSubmitting={isLoading} />;
}
