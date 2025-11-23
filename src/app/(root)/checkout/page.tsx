"use client";
import Container from "@/components/common/container";
import { Form } from "@/components/ui/form";
import React from "react";
import { useForm } from "react-hook-form";
import CustomerInformation from "./customer-information";
import TDRadioGroup from "@/components/form/TDRadioGroup";
import { paymentMethodOptions } from "@/CONST/payment-method";

export default function CheckoutPage() {
	const form = useForm();
	return (
		<div className="bg-gray-200">
			<Container className="space-y-5 py-10">
				<h3>Checkout</h3>
				<Form {...form}>
					<form className="grid grid-cols-1 lg:grid-cols-3 gap-5">
						<div className="bg-white rounded-md p-5 space-y-7 lg:col-span-1">
							<p className="text-xl font-medium pb-2 border-b">
								Customer Information
							</p>
							<CustomerInformation form={form} />
						</div>
						<div className="bg-white rounded-md p-5 space-y-5 lg:col-span-2">
							<div className="space-y-7">
								<p className="text-xl font-medium pb-2 border-b">
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
								<p className="text-xl font-medium pb-2 border-b">
									Order Overview
								</p>
							</div>
						</div>
					</form>
				</Form>
			</Container>
		</div>
	);
}
