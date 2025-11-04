import z from "zod";

export const createCategorySchema = z.object({
	name: z
		.string({ error: "Category name is required" })
		.min(2, "Min character is 2")
		.max(20, "Max character is 20")
		.trim(),
	parentId: z
		.string()
		.trim()
		.transform((val) => (val === "" ? null : val))
		.nullable()
		.optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

export type CategoryInput = z.infer<typeof createCategorySchema>;
export type CategoryUpdateInput = z.infer<typeof updateCategorySchema>;
