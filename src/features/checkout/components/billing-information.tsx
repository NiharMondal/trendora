"use client";

import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

import SpinnerLoading from "@/shared/components/loading/spinner-loading";
import TDButton from "@/shared/components/td-button";
import TDInput from "@/shared/form/TDInput";
import TDTextArea from "@/shared/form/TDTextArea";
import { cn } from "@/shared/lib/utils";
import { useMyAddressQuery } from "@/features/addresses/api/address.api";

import { TCheckoutFormValues } from "@/features/checkout/schemas/checkout-form.schema";

type AddressMode = "SELECT" | "CREATE";

export default function BillingInformation() {
    const [mode, setMode] = useState<AddressMode>("SELECT");
    const { data, isLoading } = useMyAddressQuery(undefined);

    const form = useFormContext<TCheckoutFormValues>();
    const {
        formState: { errors },
    } = form;

    const selectedId = form.watch("shippingAddressId");

    const addresses = data?.result ?? [];
    const hasAddresses = addresses.length > 0;

    useEffect(() => {
        if (data && !hasAddresses) {
            setMode("CREATE");
        }
    }, [data, hasAddresses]);

    const handleSelectAddress = (id: string) => {
        form.setValue("shippingAddressId", id, { shouldValidate: true });
        setMode("SELECT");
    };

    const switchToCreate = () => {
        form.setValue("shippingAddressId", undefined);
        setMode("CREATE");
    };

    if (isLoading) return <SpinnerLoading />;

    return (
        <div className="space-y-4">
            {hasAddresses && mode === "SELECT" && (
                <>
                    {/* A radio group: one address is chosen from several. Each was a
                        clickable <div>, unreachable by keyboard. */}
                    <div
                        className="space-y-3"
                        role="radiogroup"
                        aria-label="Shipping address"
                    >
                        {addresses.map((address) => (
                            <button
                                type="button"
                                role="radio"
                                aria-checked={selectedId === address.id}
                                key={address.id}
                                className={cn(
                                    "w-full text-left",
                                    "border rounded-md p-3 cursor-pointer transition",
                                    selectedId === address.id
                                        ? "ring-2 ring-primary border-primary"
                                        : "border-muted",
                                )}
                                onClick={() => handleSelectAddress(address.id)}
                            >
                                <span className="block font-medium">
                                    {address.fullName}
                                </span>
                                <span className="block text-sm text-gray-500">
                                    {address.phone}
                                </span>
                                <span className="block text-sm text-gray-500">
                                    {address.street}, {address.city},{" "}
                                    {address.state}, {address.postalCode},{" "}
                                    {address.country}
                                </span>
                            </button>
                        ))}
                    </div>
                    {errors.shippingAddressId && (
                        <p className="text-red-500 text-xs">
                            {errors.shippingAddressId.message}
                        </p>
                    )}

                    <TDButton
                        type="button"
                        variant="outline"
                        onClick={switchToCreate}
                        className="w-full"
                    >
                        + Add New Address
                    </TDButton>
                </>
            )}

            {mode === "CREATE" && (
                <div className="space-y-1.5">
                    <TDInput name="fullName" label="Full Name" form={form} />
                    <TDInput name="email" label="Email" type="email" form={form} />
                    <TDInput name="phone" label="Phone" form={form} />
                    <TDInput name="street" label="Street" form={form} />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                        <TDInput
                            name="postalCode"
                            label="Postal Code"
                            form={form}
                        />
                        <TDInput name="city" label="City" form={form} />
                        <TDInput
                            name="state"
                            label="State / Division"
                            form={form}
                        />
                    </div>
                    <TDInput name="country" label="Country" form={form} />
                    {hasAddresses && (
                        <TDButton
                            type="button"
                            variant="ghost"
                            onClick={() => setMode("SELECT")}
                            className="w-full"
                        >
                            ← Back to saved addresses
                        </TDButton>
                    )}
                </div>
            )}

            <TDTextArea
                form={form}
                name="notes"
                label="Order Notes (Optional)"
            />
        </div>
    );
}
