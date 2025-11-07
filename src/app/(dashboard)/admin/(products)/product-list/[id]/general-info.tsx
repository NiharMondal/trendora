import { Form } from "@/components/ui/form";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import TDInput from "@/components/form/TDInput";
import TDSelect from "@/components/form/TDSelect";
import TDTextArea from "@/components/form/TDTextArea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
	useCreateProductMutation,
	useProductByIdQuery,
} from "@/redux/api/productApi";
import { toast } from "sonner";
import { useAllCategoryQuery } from "@/redux/api/productCategoryApi";
import TDCheckbox from "@/components/form/TDCheckbox";
import { productSizes } from "@/helping-data/products";

export default function GeneralInfo({ id }: { id: string }) {
	const form = useForm({
		defaultValues: {
			name: "",
			basePrice: 0,
			discountPrice: 0,
			stockQuantity: 0,
			description: "",
			isFeatured: false,
			categoryId: "",
		},
	});

	const { data: product } = useProductByIdQuery(id);
	const { data: categories } = useAllCategoryQuery({});
	const categoryOption = categories?.result?.map((category) => {
		return {
			label: category.name,
			value: category.id,
		};
	});

	const handleUpdate = async (values) => {
		console.log(values);
	};
	useEffect(() => {
		if (product?.result) {
			form.reset({
				name: product.result.name,
				basePrice: Number(product.result.basePrice),
				discountPrice: Number(product.result.discountPrice) || 0,

				stockQuantity: product.result.stockQuantity,
				description: product.result.description,
				isFeatured: product.result.isFeatured,
				categoryId: product.result.categoryId,
			});
		}
	}, [product, id]);
	return (
		<div className="bg-white shadow-2xl rounded-2xl p-5">
			<Form {...form}>
				<form
					className="space-y-5"
					onSubmit={form.handleSubmit(handleUpdate)}
				>
					<TDInput form={form} label="Product name" name="name" />
					<TDInput
						form={form}
						label="Price"
						name="basePrice"
						type="number"
					/>
					<TDInput
						form={form}
						label="Discount Price"
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
						options={categoryOption}
					/>
					<TDTextArea
						form={form}
						label="Product description"
						name="description"
						placeholder="Write description here..."
					/>

					<TDCheckbox
						form={form}
						name="isFeatured"
						label="Featured Product"
						description="Enable this to mark as a featured item"
					/>

					<Button type="submit" size={"lg"}>
						Save
					</Button>
				</form>
			</Form>
		</div>
	);
}
