import z from "zod";

export const createProductSchema = z.object({
	name: z
		.string()
		.min(5, "Min character is 5")
		.max(30, "Max character is 30"),
	description: z
		.string()
		.min(30, "Min character is 30")
		.max(500, "Max character is 500"),
	basePrice: z.coerce
		.number({ error: "Base price is required" })
		.positive("Price should be positive")
		.max(10000, "Price should be less than 10000"),
	discountPrice: z
		.union([
			z.coerce.number().positive("Discount price should be positive"),
			z.literal("").transform(() => undefined),
		])
		.optional(),
	stockQuantity: z.coerce
		.number({ error: "Stock quantity is required" })
		.positive("Quantity should be positive")
		.min(1, "Quantity should be more than 0")
		.max(10000, "Price should be less than 10000"),
	isPublished: z.boolean().default(true),
	categoryId: z.string({ error: "Category ID is required" }),
});
