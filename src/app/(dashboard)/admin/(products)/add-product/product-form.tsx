"use client";
import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import {
	createProductSchema,
	CreateProductInput,
} from "@/form-schema/product-schema";
import TDInput from "@/components/form/TDInput";
import TDSelect from "@/components/form/TDSelect";
import TDTextArea from "@/components/form/TDTextArea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function ProductForm() {
	const form = useForm({
		resolver: zodResolver(createProductSchema),
		defaultValues: {
			name: "",
			basePrice: 20,
			categoryId: "",
			description: "",
			stockQuantity: 200,
			variants: [{ stock: 0, price: 0, color: "Blue", size: "" }],
			images: [{ isMain: false, url: "" }],
		},
	});

	const { control, handleSubmit, watch, setValue } = form;

	const {
		fields: variantFields,
		append: appendVariant,
		remove: removeVariant,
	} = useFieldArray({
		control,
		name: "variants",
	});

	const {
		fields: imageFields,
		append: appendImage,
		remove: removeImage,
	} = useFieldArray({
		control,
		name: "images",
	});

	// Optional logic: Ensure only one image isMain
	const handleSetMainImage = (index: number) => {
		const currentImages = form.getValues("images");
		const updatedImages = currentImages.map((img, i) => ({
			...img,
			isMain: i === index,
		}));
		setValue("images", updatedImages);
	};

	const createProduct = async (values: CreateProductInput) => {
		console.log("Final product data:", values);
	};

	return (
		<Form {...form}>
			<form
				className="grid grid-cols-1 md:grid-cols-2 gap-5"
				onSubmit={handleSubmit(createProduct)}
			>
				<div className="bg-white rounded-2xl shadow-lg p-5 space-y-5">
					<TDInput
						form={form}
						label="Product name"
						name="name"
						required
					/>
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
						options={[{ label: "Nihar", value: "nihar" }]}
					/>
					<TDTextArea
						form={form}
						label="Product description"
						name="description"
						placeholder="Write description here..."
						required
					/>
				</div>

				<div className="bg-white rounded-2xl shadow-lg p-5 space-y-5">
					<div className="space-y-3">
						<div className="flex items-center justify-between">
							<h3 className="text-lg font-semibold">
								Product Variants
							</h3>
							<Button
								type="button"
								variant="outline"
								onClick={() =>
									appendVariant({
										size: "",
										color: "",
										price: 0,
										stock: 0,
									})
								}
							>
								+ Add Variant
							</Button>
						</div>

						{variantFields.map((field, index) => (
							<div
								key={field.id}
								className="border p-4 rounded-lg space-y-3"
							>
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
									onClick={() => removeVariant(index)}
								>
									Remove
								</Button>
							</div>
						))}
					</div>
					<div className="space-y-3">
						<div className="flex items-center justify-between">
							<h3 className="text-lg font-semibold">
								Product Images
							</h3>
							<Button
								type="button"
								variant="outline"
								onClick={() =>
									appendImage({ url: "", isMain: false })
								}
							>
								+ Add Image
							</Button>
						</div>

						{imageFields.map((field, index) => (
							<div
								key={field.id}
								className="border p-4 rounded-lg space-y-3"
							>
								<TDInput
									form={form}
									name={`images.${index}.url`}
									label="Image URL"
									placeholder="https://example.com/image.jpg"
									required
								/>

								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3">
										<Checkbox
											id={`isMain-${index}`}
											checked={
												!!watch(
													`images.${index}.isMain`
												)
											}
											onCheckedChange={() =>
												handleSetMainImage(index)
											}
										/>
										<Label htmlFor={`isMain-${index}`}>
											Main Image
										</Label>
									</div>

									<Button
										type="button"
										variant="destructive"
										onClick={() => removeImage(index)}
									>
										Remove
									</Button>
								</div>
							</div>
						))}
					</div>
					<Button size={"lg"} className="cursor-pointer">
						+ Add Product
					</Button>
				</div>
			</form>
		</Form>
	);
}
