import z from "zod";

/**
 * Both halves of a Cloudinary upload. The backend promotes the asset out of
 * `temp/` on save and destroys the one it replaces, so dropping `publicId`
 * here orphans every replaced image.
 */
const imageSchema = z.object({
    url: z.string().trim(),
    publicId: z.string().trim(),
});

export const categorySchema = z.object({
    name: z
        .string({ error: "Category name is required" })
        .min(2, "Min character is 2")
        .max(20, "Max character is 20")
        .trim(),
    sizeGroupId: z.string().nullable(),
    parentId: z.string().nullable(),
    /** Artwork for the storefront's "shop by category" tile. Optional. */
    image: imageSchema.nullish(),
});

export type TCategoryFormValues = z.infer<typeof categorySchema>;
