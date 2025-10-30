import React from "react";
import { Button } from "@/components/ui/button";
import TDInput from "@/components/form/TDInput";
import { UseFormReturn, UseFieldArrayReturn } from "react-hook-form";
import { CreateProductInput } from "@/form-schema/product-schema";

interface Props {
	form: UseFormReturn<CreateProductInput>;
	variantArray: UseFieldArrayReturn<CreateProductInput, "variants", "id">;
}

export default function ProductVariants({ form, variantArray }: Props) {
	const { fields, append, remove } = variantArray;

	return (
		<div className="bg-white shadow-md p-8 rounded-2xl space-y-5">
			<div className="flex items-center justify-between">
				<h3 className="text-lg font-semibold">Product Variants</h3>
				<Button
					type="button"
					variant="outline"
					onClick={() =>
						append({ size: "", color: "", price: 0, stock: 0 })
					}
				>
					+ Add Variant
				</Button>
			</div>

			{fields.map((field, index) => (
				<div key={field.id} className="border p-4 rounded-lg space-y-3">
					<div className="grid grid-cols-2 gap-4">
						<TDInput
							form={form}
							name={`variants.${index}.size`}
							label="Size"
							placeholder="M, L, XL"
							required
						/>
						<TDInput
							form={form}
							name={`variants.${index}.color`}
							label="Color"
							placeholder="Red"
							required
						/>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<TDInput
							form={form}
							name={`variants.${index}.price`}
							type="number"
							label="Variant Price"
							placeholder="19.99"
							required
						/>
						<TDInput
							form={form}
							name={`variants.${index}.stock`}
							type="number"
							label="Variant Stock"
							placeholder="50"
							required
						/>
					</div>

					<Button
						type="button"
						variant="destructive"
						onClick={() => remove(index)}
					>
						Remove
					</Button>
				</div>
			))}
		</div>
	);
}
