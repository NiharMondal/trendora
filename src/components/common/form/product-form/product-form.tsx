"use client";
import TDSeparator from "@/components/common/@ui/td-separator";
import TDButton from "@/components/common/td-button";
import TDCheckbox from "@/components/form-input/TDCheckbox";
import TDCombobox from "@/components/form-input/TDCombobox";
import TDInput from "@/components/form-input/TDInput";
import TDTextArea from "@/components/form-input/TDTextArea";
import { Form } from "@/components/ui/form";
import {
	TProductFormValues,
	productSchema,
} from "@/form-schema/product-schema";
import { useAllBrandQuery } from "@/redux/api/brandApi";
import { useAllCategoryQuery } from "@/redux/api/productCategoryApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import ImageVariant from "./image-variant";
import ProductVariant from "./product-variant";

type ProductFormProps = {
	productId?: string;
	defaultValues?: TProductFormValues;
	onSubmit: (values: TProductFormValues) => Promise<void> | void;
	isLoading: boolean;
};
export default function ProductForm({
	productId,
	defaultValues,
	onSubmit,
	isLoading,
}: ProductFormProps) {
	const { data: categories } = useAllCategoryQuery({});
	const { data: brands } = useAllBrandQuery({});
	const categoryOption = categories?.result?.map((category) => ({
		label: category.name,
		value: category.id,
	}));
	const brandOption = brands?.result?.map((brand) => ({
		label: brand.name,
		value: brand.id,
	}));
	const form = useForm({
		resolver: zodResolver(productSchema),
		defaultValues: defaultValues ?? {
			name: "",
			basePrice: 0,
			discountPrice: undefined,
			categoryId: "",
			description: "",
			stockQuantity: 200,
			isFeatured: false,
			brandId: "",
			variants: [{ stock: 0, price: 0, color: "", size: "" }],
			images: [{ isMain: true, url: "" }],
		},
	});

	const handleProductSubmit = (values: TProductFormValues) => {
		onSubmit(values);
	};

	return (
		<Form {...form}>
			<form
				className="flex flex-col gap-5"
				onSubmit={form.handleSubmit(handleProductSubmit)}
			>
				<div className="bg-white rounded-md p-5 space-y-5">
					<h5 className="text-lg font-semibold">
						Product Information
					</h5>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-1.5">
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
							placeholder="120.99"
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
						<TDCombobox
							form={form}
							label="Category"
							name="categoryId"
							placeholder="Select category"
							searchPlaceholder="Search categories..."
							emptyText="No category found."
							required
							options={categoryOption || []}
						/>
						<TDCombobox
							form={form}
							label="Brand"
							name="brandId"
							placeholder="Select Brand"
							searchPlaceholder="Search categories..."
							emptyText="No Brand found."
							required
							options={brandOption || []}
						/>
					</div>
					<TDTextArea
						form={form}
						label="Product description"
						name="description"
						placeholder="Write description here..."
						required
					/>

					<div className="border p-4 rounded-md">
						<TDCheckbox
							form={form}
							name="isFeatured"
							label="Featured Product"
							description="Enable this to mark as a featured item"
						/>
					</div>
				</div>

				<div className="bg-white shadow rounded-md  p-5 space-y-5">
					{/** product images */}
					<ImageVariant />
					{/** separator */}
					<TDSeparator className="my-10" />

					{/** product variants */}
					<ProductVariant />
					<TDButton type="submit" isLoading={isLoading}>
						{productId ? "Update Product" : "Create Product"}
					</TDButton>
				</div>
			</form>
		</Form>
	);
}
