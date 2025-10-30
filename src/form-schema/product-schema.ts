import z from "zod";

//product variant
const productVariant = z.object({
	size: z.string({ error: "Variant size is required" }).trim().optional(),
	color: z.string({ error: "Variant color is required" }).trim().optional(),
	stock: z.coerce.number({ error: "Variant stock is required" }).optional(),
	price: z.coerce.number({ error: "Variant price is required" }).optional(),
});

//product image
const productImage = z.object({
	url: z
		.string({ error: "Image|URL is required" })
		.nonempty("At least one photo is required")
		.trim(),
	isMain: z.coerce.boolean().optional(),
});

//product schema
export const createProductSchema = z.object({
	name: z
		.string()
		.min(5, "Min character is 5")
		.max(50, "Max character is 50")
		.trim(),
	description: z
		.string()
		.min(30, "Min character is 30")
		.max(500, "Max character is 500")
		.trim(),
	basePrice: z.coerce
		.number({ error: "Base price is required" })
		.min(1, "Price should be positive")
		.max(10000, "Price should be less than 10000"),
	discountPrice: z.coerce.number().optional(),
	stockQuantity: z.coerce
		.number({ error: "Stock quantity is required" })
		.positive("Quantity should be positive")
		.min(1, "Quantity should be more than 0")
		.max(10000, "Price should be less than 10000"),

	categoryId: z
		.string({ error: "Category ID is required" })
		.nonempty("Category can not be empty")
		.trim(),
	variants: z.array(productVariant).optional(),
	images: z.array(productImage).min(1, "Provide at least 1 image"),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
