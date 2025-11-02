"use client";
import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import {
	createProductSchema,
	CreateProductFormValues,
} from "@/form-schema/product-schema";
import TDInput from "@/components/form/TDInput";
import TDSelect from "@/components/form/TDSelect";
import TDTextArea from "@/components/form/TDTextArea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useCreateProductMutation } from "@/redux/api/productApi";
import { toast } from "sonner";
import { useAllCategoryQuery } from "@/redux/api/productCategoryApi";
import TDCheckbox from "@/components/form/TDCheckbox";
import { productSizes } from "@/helping-data/products";

export default function ProductForm() {
	const { data: categories } = useAllCategoryQuery(undefined);

	const categoryOption = categories?.result?.map((category) => {
		return {
			label: category.name,
			value: category.id,
		};
	});

	const [createProduct] = useCreateProductMutation();
	const form = useForm({
		resolver: zodResolver(createProductSchema),
		defaultValues: {
			name: "",
			basePrice: 0,
			discountPrice: "",
			categoryId: "",
			description: "",
			stockQuantity: 200,
			isFeatured: false,

			variants: [{ stock: 0, price: 0, color: "", size: "" }],
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

	const handleCreateProduct = async (values: CreateProductFormValues) => {
		try {
			await createProduct(values).unwrap();
			toast.success("Product created successfully");
		} catch (error: any) {
			console.log(error);
			toast.error(error?.data.message);
		}
	};

	return (
		<Form {...form}>
			<form
				className="grid grid-cols-1 md:grid-cols-2 gap-5"
				onSubmit={handleSubmit(handleCreateProduct)}
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
						options={categoryOption}
					/>
					<TDTextArea
						form={form}
						label="Product description"
						name="description"
						placeholder="Write description here..."
						required
					/>

					<TDCheckbox
						form={form}
						name="isFeatured"
						label="Featured Product"
						description="Enable this to mark as a featured item"
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
									<TDSelect
										form={form}
										name={`variants.${index}.size`}
										label="Size"
										placeholder="Select Size"
										options={productSizes}
										className="w-full"
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
							<div>
								<h3 className="text-lg font-semibold">
									Product Images
								</h3>
								<p className="text-xs text-muted-foreground">
									Provide at least one image
								</p>
							</div>
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
