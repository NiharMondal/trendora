import z from "zod";

export const categorySchema = z.object({
    name: z
        .string({ error: "Category name is required" })
        .min(2, "Min character is 2")
        .max(20, "Max character is 20")
        .trim(),
    sizeGroupId: z.string().nullable(),
    parentId: z.string().nullable(),
});

export type TCategoryFormValues = z.infer<typeof categorySchema>;
