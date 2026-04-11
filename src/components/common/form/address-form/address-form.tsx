import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import TDInput from "@/components/form-input/TDInput";
import { Form } from "@/components/ui/form";

import TDRadioGroup from "@/components/form-input/TDRadioGroup";
import TDButton from "../../shared/td-button";
import { addressSchema, TAddressFormValues } from "./address-form-schema";

type Props = {
    defaultValues?: TAddressFormValues | null;
    onSubmit: (values: TAddressFormValues) => Promise<boolean | void> | boolean | void;
    isSubmitting: boolean;
    onSuccess?: () => void;
};
export default function AddressForm({
    defaultValues,
    onSubmit,
    onSuccess,
    isSubmitting,
}: Props) {
    const hookForm = useForm<TAddressFormValues>({
        resolver: zodResolver(addressSchema),
        defaultValues: defaultValues ?? {
            fullName: "",
            email: "",
            phone: "",
            street: "",
            city: "",
            state: "",
            postalCode: "",
            country: "",
            isDefault: false,
        },
    });

    const handleAddressSubmit = async (values: TAddressFormValues) => {
        const success = await onSubmit(values);
        if (success) {
            hookForm.reset();
            onSuccess?.();
        }
    };
    return (
        <Form {...hookForm}>
            <form
                className="sm:space-y-5 overflow-y-auto"
                onSubmit={hookForm.handleSubmit(handleAddressSubmit)}
            >
                <div className="grid sm:grid-cols-2 gap-x-4 sm:gap-y-1.5">
                    <TDInput
                        name="fullName"
                        label="Fullname"
                        form={hookForm}
                        required
                    />
                    <TDInput
                        name="email"
                        label="Email"
                        form={hookForm}
                        required
                    />
                    <TDInput
                        name="phone"
                        label="Phone"
                        form={hookForm}
                        required
                    />
                    <TDInput
                        name="street"
                        label="Address"
                        form={hookForm}
                        required
                    />
                    <TDInput
                        name="city"
                        label="City"
                        form={hookForm}
                        required
                    />
                    <TDInput
                        name="state"
                        label="State / Division"
                        form={hookForm}
                    />
                    <TDInput
                        name="postalCode"
                        label="Postal code"
                        form={hookForm}
                        required
                    />
                    <TDInput
                        name="country"
                        label="Country"
                        form={hookForm}
                        required
                    />
                    <TDRadioGroup
                        name="isDefault"
                        label="Default address"
                        form={hookForm}
                        options={[
                            { label: "Yes", value: true },
                            { label: "No", value: false },
                        ]}
                        valueType="boolean"
                    />
                </div>

                <TDButton type="submit" isLoading={isSubmitting}>
                    Create New Address
                </TDButton>
            </form>
        </Form>
    );
}
