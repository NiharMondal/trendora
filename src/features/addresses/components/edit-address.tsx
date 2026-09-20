import AddressForm from "@/features/addresses/components/address-form";
import { TAddressFormValues } from "@/features/addresses/schemas/address-form.schema";
import { TAddress } from "@/features/addresses/types/address.types";
import { useUpdateAddressMutation } from "@/features/addresses/api/address.api";
import { toast } from "sonner";

export default function EditAddress({
    handleCloseDrawer,
    selectedAddress,
}: {
    handleCloseDrawer: () => void;
    selectedAddress: TAddress | null;
}) {
    const [updateAddress, { isLoading }] = useUpdateAddressMutation();
    const onSubmit = async (data: TAddressFormValues) => {
        try {
            const res = await updateAddress({ payload: data, id: selectedAddress?.id as string }).unwrap();
            if (res?.success) {
                toast.success(res?.message);
                return true;
            }
        } catch (error: any) {
            toast.error(error?.data?.message || "Something went wrong!");
            return false;
        }
    };
    const handleSuccess = () => {
        handleCloseDrawer();
    };
    return (
        <div className="pb-5">
            <AddressForm
                onSubmit={onSubmit}
                isSubmitting={isLoading}
                onSuccess={handleSuccess}
                defaultValues={selectedAddress}
            />
        </div>
    );
}
