"use client";
import { Form } from "@/components/ui/form";
import { createProductSchema } from "@/helper/schema/product.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
export default function ProductForm() {
	const form = useForm<z.infer<typeof createProductSchema>>({});
	return (
		<Form {...form}>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
				<div className="bg-white shadow-md p-8 rounded-2xl"></div>
				<div className="bg-white shadow-md p-8 rounded-2xl"></div>
			</div>
		</Form>
	);
}
