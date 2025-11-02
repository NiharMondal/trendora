"use client";
import TDInput from "@/components/form/TDInput";
import TDSelect from "@/components/form/TDSelect";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
	CategoryInput,
	createCategorySchema,
} from "@/form-schema/category-schema";
import { useCreateCategoryMutation } from "@/redux/api/productCategoryApi";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
export default function CategoryForm() {
	const [createCategory] = useCreateCategoryMutation();
	const form = useForm<CategoryInput>({
		resolver: zodResolver(createCategorySchema),
		defaultValues: {
			name: "",
			parentId: "",
		},
	});

	const handleCreateCategory = async (values: CategoryInput) => {
		try {
			await createCategory(values).unwrap();
			toast.success("Category created successfully");
		} catch (error: any) {
			toast.error(error?.data?.message);
			console.log(error);
		}
	};
	return (
		<Form {...form}>
			<form
				className="space-y-5 p-5 shadow-md bg-white rounded-2xl"
				onSubmit={form.handleSubmit(handleCreateCategory)}
			>
				<TDInput name="name" label="Name" form={form} required />
				<TDSelect
					form={form}
					name="parentId"
					label="Parent ID"
					className="w-full"
				/>

				<Button type="submit">+ Add Category</Button>
			</form>
		</Form>
	);
}
