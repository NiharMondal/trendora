import z from "zod";

export const brandSchema = z.object({
	name: z.string().min(1, "Brand name is required"),
	logo: z.string().optional(),
});

export type TBrandFormValues = z.infer<typeof brandSchema>;
