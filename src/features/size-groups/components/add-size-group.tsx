"use client";
import { toast } from "sonner";

import SizeGroupForm from "@/features/size-groups/components/size-group-form";
import { TSizeGroupFormValues } from "@/features/size-groups/schemas/size-group-form.schema";
import { useCreateSizeGroupMutation } from "@/features/size-groups/api/size-group.api";

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
