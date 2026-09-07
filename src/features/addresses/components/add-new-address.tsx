import AddressForm from "@/features/addresses/components/address-form";
import { TAddressFormValues } from "@/features/addresses/schemas/address-form.schema";
import { useCreateAddressMutation } from "@/features/addresses/api/address.api";
import { toast } from "sonner";

export default function AddNewAddress({
    handleCloseDrawer,
}: {
    handleCloseDrawer: () => void;
}) {
    const [createAddress, { isLoading }] = useCreateAddressMutation();
    const onSubmit = async (data: TAddressFormValues) => {
        try {
            const res = await createAddress(data).unwrap();
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
            />
        </div>
    );
}
