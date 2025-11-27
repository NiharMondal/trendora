import TDInput from "@/components/form/TDInput";
import React from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";
type Props = {
	form: UseFormReturn<FieldValues, any, FieldValues>;
};
export default function CustomerInformation({ form }: Props) {
	return (
		<div className="space-y-5">
			<TDInput name="fullname" label="Fullname" form={form} />
			<TDInput name="phone" label="Phone" form={form} />
			<TDInput name="street" label="Street" form={form} />
			<TDInput name="city" label="City" form={form} />
			<TDInput name="state" label="State / Division" form={form} />
			<TDInput name="postalCode" label="Postal code" form={form} />
			<TDInput name="country" label="Country" form={form} />
		</div>
	);
}
