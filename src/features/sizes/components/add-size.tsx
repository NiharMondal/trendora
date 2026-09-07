"use client";
import { toast } from "sonner";

import SizeForm from "@/features/sizes/components/size-form";
import { TSizeFormValues } from "@/features/sizes/schemas/size-form.schema";
import { useCreateSizeMutation } from "@/features/sizes/api/size.api";

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
