import z from "zod";

export const sizeGroupSchema = z.object({
	name: z
		.string({ error: "Size group name is required" })
		.min(2, "Min character is 2")
		.max(20, "Max character is 20")
		.trim(),
});

export type TSizeGroupFormValues = z.infer<typeof sizeGroupSchema>;
