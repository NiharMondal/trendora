import z from "zod";

export const sizeFormSchema = z.object({
	name: z
		.string()
		.min(1, {
			error: "Size name must be at least 1 characters",
		})
		.max(10, {
			error: "Size name must be at most 10 characters",
		}),
	sizeGroupId: z
		.string({
			error: "Size group ID is required",
		}).nonempty({error: "Size group ID is required"})
});

export type TSizeFormValues = z.infer<typeof sizeFormSchema>;
