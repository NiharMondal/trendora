"use client";
import TDButton from "@/components/common/shared/td-button";
import TDRadioGroup from "@/components/form-input/TDRadioGroup";
import { Form } from "@/components/ui/form";
import { useCreateOrderMutation } from "@/redux/api/orderApi";
import { useAppSelector } from "@/redux/redux.hooks";
import { selectCartItems } from "@/redux/slice/cartSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
	checkoutFormSchema,
	TCheckoutFormValues,
} from "./checkout-form-schema";
import CustomerInformation from "./customer-information";
import { paymentMethodOptions } from "./payment-method-options";

export default function CheckoutForm() {
	const [createOrder, { isLoading }] = useCreateOrderMutation();
	const cartItems = useAppSelector(selectCartItems);
	const form = useForm<TCheckoutFormValues>({
		resolver: zodResolver(checkoutFormSchema),
		defaultValues: {
			userId: "",
			shippingAddressId: "",
			paymentMethod: "",
			notes: "",
		},
	});
	const handleCreateOrder = async (values: TCheckoutFormValues) => {
		const payload = {
			userId: "7c99679d-412f-4819-93a0-08861f270c8e",
			items: cartItems.map((item) => ({
				productId: item.productId,
				variantId: item?.variantId || undefined,
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
		try {
			await createOrder(payload as any).unwrap();
			toast.success("Order placed successfully");
		} catch (error: any) {
			toast.error(error?.data?.message);
		}

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
						<TDButton
							type="submit"
							className="w-full font-bold"
							isLoading={isLoading}
						>
							Place Order
						</TDButton>
					</div>
				</div>
			</form>
		</Form>
	);
}
