"use client";
import TDInput from "@/components/form/TDInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import React from "react";
import { useForm } from "react-hook-form";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Pen } from "lucide-react";
export default function UpdateAddress() {
	const form = useForm();
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant={"secondary"} size={"sm"}>
					<Pen />
				</Button>
			</DialogTrigger>
			<DialogContent className="w-full md:min-w-3xl">
				<DialogTitle className="mb-3">Update Address</DialogTitle>
				<Form {...form}>
					<form className="space-y-5 ">
						<TDInput name="fullname" label="Fullname" form={form} />
						<TDInput name="phone" label="Phone" form={form} />
						<TDInput name="street" label="Street" form={form} />
						<TDInput name="city" label="City" form={form} />
						<TDInput
							name="state"
							label="State / Division"
							form={form}
						/>
						<TDInput
							name="postalCode"
							label="Postal code"
							form={form}
						/>
						<TDInput name="country" label="Country" form={form} />

						<Button> Create New Address</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
