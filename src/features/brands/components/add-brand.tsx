"use client";
import { toast } from "sonner";

import BrandForm from "@/features/brands/components/brand-form";
import { TBrandFormValues } from "@/features/brands/schemas/brand-form.schema";
import { useCreateBrandMutation } from "@/features/brands/api/brand.api";
import { getApiErrorMessage } from "@/shared/utils/api-error";

export default function AddBrand() {
    const [createBrand, { isLoading }] = useCreateBrandMutation();

    const handleCreateBrand = async (values: TBrandFormValues) => {
        try {
            await createBrand(values).unwrap();
            toast.success("Brand added successfully");
        } catch (error) {
            toast.error(getApiErrorMessage(error));
        }
    };
    return <BrandForm onSubmit={handleCreateBrand} isSubmitting={isLoading} />;
}
