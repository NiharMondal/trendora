import z from "zod";

//product variant
export const productVariant = z.object({
    size: z
        .string({ error: "Variant size is required" })
        .nonempty({ error: "Variant Size is required" })
        .trim(),
    color: z
        .string({ error: "Variant color is required" })
        .nonempty({ error: "Variant color is required" })
        .trim()
        .transform(
            (val) => val.charAt(0).toUpperCase() + val.slice(1).toLowerCase(),
        ),
    stock: z.coerce
        .number({ error: "Variant stock is required" })
        .positive("Number of stock must be positive"),
    price: z.coerce
        .number({ error: "Variant price is required" })
        .positive("Price must be positive"),
});
export type ZTProductVariant = z.infer<typeof productVariant>;
//product image
export const productImage = z.object({
    url: z
        .string({ error: "Image URL is required" })
        .nonempty("Image URL is required")
        .trim(),
    isMain: z.coerce.boolean().optional(),
});
export type ZTProductImage = z.infer<typeof productImage>;
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
    discountPrice: z
        .union([z.coerce.number().min(0).max(10000), z.literal("")])
        .optional()
        .transform((val) => (val === "" || 0 ? null : val)),
    stockQuantity: z.coerce
        .number({ error: "Stock quantity is required" })
        .positive("Quantity should be positive")
        .min(1, "Quantity should be more than 0")
        .max(10000, "Price should be less than 10000"),

    categoryId: z
        .string({ error: "Category ID is required" })
        .nonempty("Category can not be empty")
        .trim(),
    isFeatured: z.boolean(),
    variants: z.array(productVariant),
    images: z.array(productImage).min(1, "Provide at least 1 image"),
});
export type CreateProductFormValues = z.infer<typeof createProductSchema>;
const updateProduct = createProductSchema.optional();

export type UpdateProductFromValues = z.infer<typeof updateProduct>;

export const updateProductGeneralInfo = z.object({
    name: z
        .string()
        .min(5, "Min character is 5")
        .max(50, "Max character is 50")
        .trim()
        .optional(),
    description: z
        .string()
        .min(30, "Min character is 30")
        .max(500, "Max character is 500")
        .trim()
        .optional(),
    basePrice: z.coerce
        .number({ error: "Base price is required" })
        .min(1, "Price should be positive")
        .max(10000, "Price should be less than 10000")
        .optional(),
    discountPrice: z
        .union([z.coerce.number().min(0).max(10000), z.literal("")])
        .optional()
        .transform((val) => (val === "" || 0 ? null : val)),
    stockQuantity: z.coerce
        .number({ error: "Stock quantity is required" })
        .positive("Quantity should be positive")
        .min(1, "Quantity should be more than 0")
        .max(10000, "Price should be less than 10000")
        .optional(),

    categoryId: z
        .string({ error: "Category ID is required" })
        .nonempty("Category can not be empty")
        .trim()
        .optional(),
    isFeatured: z.boolean().optional(),
});

export type UpdateProductGeneralFormValues = z.infer<
    typeof updateProductGeneralInfo
>;
