"use client";
import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import {
	createProductSchema,
	CreateProductFormValues,
	UpdateProductFromValues,
} from "@/form-schema/product-schema";
import {
	useProductByIdQuery,
	useUpdateProductMutation,
} from "@/redux/api/productApi";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import TDInput from "@/components/form/TDInput";
import TDSelect from "@/components/form/TDSelect";
import TDTextArea from "@/components/form/TDTextArea";
import TDCheckbox from "@/components/form/TDCheckbox";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { productSizes } from "@/helping-data/products";
import { useAllCategoryQuery } from "@/redux/api/productCategoryApi";
import Image from "next/image";

export default function UpdateProductForm({
	productId,
}: {
	productId: string;
}) {
	const { data: productDetails } = useProductByIdQuery(productId);
	const { data: categories } = useAllCategoryQuery({});
	const categoryOptions = categories?.result.map((cat) => ({
		label: cat.name,
		value: cat.id,
	}));
	const [updateProduct] = useUpdateProductMutation();
	const productData = productDetails?.result;
	const form = useForm({
		resolver: zodResolver(createProductSchema),
		defaultValues: {
			name: "",
			basePrice: 0,
			discountPrice: "",
			categoryId: "",
			description: "",
			stockQuantity: 0,
			isFeatured: false,
			variants: [],
			images: [],
		},
	});

	const { control, handleSubmit, setValue, reset, watch } = form;

	// field arrays
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

	// When productData loads, prefill form
	useEffect(() => {
		if (productData) {
			reset({
				name: productData.name,
				basePrice: Number(productData.basePrice),
				discountPrice: productData.discountPrice
					? Number(productData.discountPrice)
					: "",
				categoryId: productData.categoryId,
				description: productData.description,
				stockQuantity: productData.stockQuantity,
				isFeatured: productData.isFeatured,
				variants:
					productData.variants?.map((v) => ({
						id: v.id, // keep IDs for existing variants
						size: v.size,
						color: v.color,
						stock: v.stock,
						price: Number(v.price),
					})) ?? [],
				images:
					productData.images?.map((img) => ({
						id: img.id, // keep IDs for existing images
						url: img.url,
						isMain: img.isMain,
					})) ?? [],
			});
		}
	}, [productData, reset]);

	const handleSetMainImage = (index: number) => {
		const images = form.getValues("images");
		const updated = images.map((img, i) => ({
			...img,
			isMain: i === index,
		}));
		setValue("images", updated);
	};

	const handleUpdate = async (values: UpdateProductFromValues) => {
		try {
			await updateProduct({ id: productId, payload: values }).unwrap();
			toast.success("Product updated successfully");
		} catch (error: any) {
			console.log(error);
			toast.error(error?.data?.message || "Update failed");
		}
	};

	return (
		<Form {...form}>
			<form
				className="grid grid-cols-1 md:grid-cols-2 gap-5"
				onSubmit={handleSubmit(handleUpdate)}
			>
				{/* BASIC INFO */}
				<div className="bg-white rounded-2xl shadow-lg p-5 space-y-5">
					<TDInput form={form} label="Product name" name="name" />
					<TDInput
						form={form}
						label="Price"
						name="basePrice"
						type="number"
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
					/>
					<TDSelect
						form={form}
						label="Category"
						name="categoryId"
						placeholder="Select category"
						className="w-full"
						options={categoryOptions}
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

				{/* VARIANTS & IMAGES */}
				<div className="bg-white rounded-2xl shadow-lg p-5 space-y-5">
					{/* Variants */}
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
									/>
									<TDInput
										form={form}
										name={`variants.${index}.color`}
										label="Color"
										placeholder="Red"
									/>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<TDInput
										form={form}
										name={`variants.${index}.price`}
										type="number"
										label="Variant Price"
										placeholder="19.99"
									/>
									<TDInput
										form={form}
										name={`variants.${index}.stock`}
										type="number"
										label="Variant Stock"
										placeholder="50"
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

					{/* Images */}
					<div className="space-y-3">
						<div className="flex items-center justify-between">
							<h3 className="text-lg font-semibold">
								Product Images
							</h3>
						</div>
						<div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
							{productDetails?.result?.images.map(
								(image, index) => (
									<div
										key={image.id}
										className="relative border rounded-md"
									>
										<Image
											src={image.url}
											alt={`${image.url}-${index}`}
											width={200}
											height={200}
											className="size-[200px] rounded-md object-top object-cover aspect-auto scale-75"
										/>
									</div>
								)
							)}
							<div className="size-[175px] flex items-center justify-center border rounded-md">
								<Button
									type="button"
									variant="outline"
									onClick={() =>
										appendImage({
											url: "",
											isMain: false,
										})
									}
								>
									+ Add Image
								</Button>
							</div>
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

					<Button size="lg" className="cursor-pointer">
						Update Product
					</Button>
				</div>
			</form>
		</Form>
	);
}
