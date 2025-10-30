import React from "react";
import TDInput from "@/components/form/TDInput";
import TDSelect from "@/components/form/TDSelect";
import TDTextArea from "@/components/form/TDTextArea";
import { UseFormReturn } from "react-hook-form";
import { CreateProductInput } from "@/form-schema/product-schema";

interface Props {
	form: UseFormReturn<CreateProductInput>;
}

export default function ProductFormMain({ form }: Props) {
	return (
		<div className="bg-white shadow-md p-8 rounded-2xl space-y-5">
			<TDInput form={form} label="Product name" name="name" required />
			<TDInput
				form={form}
				label="Price"
				name="basePrice"
				type="number"
				required
			/>
			<TDInput
				form={form}
				label="Discount price"
				name="discountPrice"
				type="number"
			/>
			<TDInput
				form={form}
				label="Stock quantity"
				name="stockQuantity"
				type="number"
				required
			/>
			<TDSelect
				form={form}
				label="Category"
				name="categoryId"
				placeholder="Select category"
				className="w-full"
				required
			/>
			<TDTextArea
				form={form}
				label="Product description"
				name="description"
				placeholder="Write description here..."
				required
			/>
		</div>
	);
}
