"use client";
import { toast } from "sonner";

import BrandForm from "@/features/brands/components/brand-form";
import { TBrandFormValues } from "@/features/brands/schemas/brand-form.schema";
import { useCreateBrandMutation } from "@/features/brands/api/brand.api";

export default function AddBrand() {
    const [createBrand, { isLoading }] = useCreateBrandMutation();

    const handleCreateBrand = async (values: TBrandFormValues) => {
        try {
            await createBrand(values).unwrap();
            toast.success("Brand added successfully");
        } catch (error: any) {
            toast.error(error?.data.message);
        }
    };
    return <BrandForm onSubmit={handleCreateBrand} isSubmitting={isLoading} />;
}
