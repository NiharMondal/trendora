"use client";
import { toast } from "sonner";

import BrandForm from "@/components/common/form/brand-form/brand-form";
import { TBrandFormValues } from "@/components/common/form/brand-form/brand-form-schema";
import { useCreateBrandMutation } from "@/redux/api/brandApi";

export default function AddBrand() {
    const [createBrand, { isLoading }] = useCreateBrandMutation();

    const handleCreateBrand = async (values: TBrandFormValues) => {
        try {
            await createBrand(values).unwrap();
            toast.success("Brand created successfully");
        } catch (error: any) {
            toast.error(error?.data.message);
        }
    };
    return <BrandForm onSubmit={handleCreateBrand} isSubmitting={isLoading} />;
}
