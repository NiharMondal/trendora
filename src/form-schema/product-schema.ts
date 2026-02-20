import z from "zod";
//product variant
export const productVariantSchema = z.object({
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
export type TProductVariant = z.infer<typeof productVariantSchema>;
//product image
export const productImageSchema = z.object({
    url: z
        .url({ error: "Provide valid URL" })
        .nonempty("Image URL is required")
        .trim(),
    publicId: z.string().trim(),
    altText:z.string().trim().optional(),
    isMain: z.coerce.boolean().optional(),
});
export type TProductImage = z.infer<typeof productImageSchema>;
//product schema
export const productSchema = z
    .object({
        name: z
            .string()
            .min(1, "Product name is required")
            .max(255, "Name is too long"),
        description: z
            .string()
            .min(30, "Description must be at least 30 characters"),
        basePrice: z.coerce
            .number({ error: "Base price is required" })
            .positive("Base price must be greater than 0"),
        discountPrice: z
            .union([z.string(), z.number(), z.undefined()])
            .transform((val) => {
                if (val === "" || val === null || val === undefined)
                    return undefined;
                const num = typeof val === "string" ? parseFloat(val) : val;
                return isNaN(num) ? undefined : num;
            })
            .pipe(z.number().positive("Discount price must be greater than 0"))
            .optional(),
        stockQuantity: z.coerce
            .number({ error: "Stock quantity must be a number" })
            .int("Stock quantity must be an integer")
            .min(0, "Stock quantity cannot be negative"),
        isFeatured: z.boolean().optional(),
        categoryId: z.string().min(1, "Category is required"),
        brandId: z.string().min(1, "Brand is required"),
        variants: z
            .array(productVariantSchema)
            .min(1, "At least one variant is required")
            .refine(
                (variants) => variants.some((v) => v.stock > 0),
                "At least one variant must have stock available",
            ),
        images: z
            .array(productImageSchema)
            .min(1, "At least one image is required")
            .refine(
                (images) => images.filter((img) => img.isMain).length === 1,
                "Exactly one image must be marked as main",
            ),
    })
    .superRefine((data, ctx) => {
        // Validate that discount price is less than base price
        if (data.discountPrice && typeof data.discountPrice === "number") {
            if (data.discountPrice >= data.basePrice) {
                ctx.addIssue({
                    code: "custom",
                    message: "Discount price must be less than base price",
                    path: ["discountPrice"],
                });
            }
        }
    });
export type TProductFormValues = z.infer<typeof productSchema>;
