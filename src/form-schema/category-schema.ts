import z from "zod";

export const categorySchema = z.object({
	name: z
		.string({ error: "Category name is required" })
		.min(2, "Min character is 2")
		.max(20, "Max character is 20")
		.trim(),
	sizeGroupId: z
			.string({ error: "Size group is required" }).nonempty({ error: "Size group is required" }),
		parentId: z
			.string()
			.trim()
			.transform((val) => (val === "" ? null : val))
			.nullable()
			.optional(),
});

export type TCategoryFormValues = z.infer<typeof categorySchema>;
