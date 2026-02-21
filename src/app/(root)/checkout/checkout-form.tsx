"use client";
import TDButton from "@/components/common/td-button";
import TDRadioGroup from "@/components/form-input/TDRadioGroup";
import { Form } from "@/components/ui/form";
import { paymentMethodOptions } from "@/CONST/payment-method";
import { useAppSelector } from "@/redux/redux.hooks";
import { selectCartItems, selectTotalAmount } from "@/redux/slice/cartSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
	checkoutFormSchema,
	TCheckoutFormValues,
} from "./checkout-form-schema";
import CustomerInformation from "./customer-information";

export default function CheckoutForm() {
	const cartItems = useAppSelector(selectCartItems);
	const totalAmount = useAppSelector(selectTotalAmount);
	const form = useForm<TCheckoutFormValues>({
		resolver: zodResolver(checkoutFormSchema),
		defaultValues: {
			shippingAddressId: "",
			paymentMethod: "",
			notes: "",
		},
	});
	const handleCreateOrder = (values: TCheckoutFormValues) => {
		const payload = {
			items: cartItems.map((item) => ({
				productId: item.productId,
				variantId: item.variantId,
				quantity: item.quantity,
			})),
			paymentMethod: values.paymentMethod,
			note: values.notes,
			...(values.shippingAddressId
				? { shippingAddressId: values.shippingAddressId }
				: {
						address: {
							fullName: values.fullName,
							phone: values.phone,
							street: values.street,
							city: values.city,
							state: values.state,
							postalCode: values.postalCode,
							country: values.country,
						},
					}),
		};
		console.log(payload);
	};

	return (
		<Form {...form}>
			<form
				className="grid grid-cols-1 lg:grid-cols-2 gap-5"
				onSubmit={form.handleSubmit(handleCreateOrder)}
			>
				<div className="bg-white rounded-md p-5 space-y-7 lg:col-span-1">
					<p className="text-lg font-medium pb-2 border-b">
						Billing Information
					</p>
					<CustomerInformation />
				</div>
				<div className="bg-white rounded-md p-5 space-y-5">
					<div className="space-y-7">
						<p className="text-lg font-medium pb-2 border-b">
							Payment Method
						</p>
						<TDRadioGroup
							name="paymentMethod"
							label="Select a payment method"
							form={form}
							options={paymentMethodOptions}
						/>
					</div>
					<div className="space-y-7">
						<p className="text-lg font-medium pb-2 border-b">
							Order Overview
						</p>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
							{cartItems.map((item) => (
								<div
									key={`${item.productId}-${item.variantId}`}
									className="flex items-center gap-3 border border-muted rounded-md p-3"
								>
									<img
										src={item.productImage}
										alt={item.productName}
										className="size-16 object-cover rounded"
									/>
									<div>
										<p className="font-medium">
											{item.productName}
										</p>
										<p className="text-sm text-gray-500">
											{item.quantity} x ${item.price}
										</p>
									</div>
								</div>
							))}
						</div>
						<TDButton type="submit" className="w-full font-bold">
							<span className="mr-1">${totalAmount}</span> Place
							Order
						</TDButton>
					</div>
				</div>
			</form>
		</Form>
	);
}
