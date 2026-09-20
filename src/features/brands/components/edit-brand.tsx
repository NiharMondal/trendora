import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { toast } from "sonner";

import BrandForm from "@/features/brands/components/brand-form";
import { TBrandFormValues } from "@/features/brands/schemas/brand-form.schema";
import SpinnerLoading from "@/shared/components/loading/spinner-loading";
import {
    useBrandByIdQuery,
    useUpdateBrandMutation,
} from "@/features/brands/api/brand.api";

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
            // logo: selectedBrand?.result?.logo,
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
        console.log(values);
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
