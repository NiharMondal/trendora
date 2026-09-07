import { z } from "zod";

export const profileFormSchema = z.object({
    name: z.string().min(1, "Name is required"),
    phone: z.string().min(1, "Contact number is required"),
    avatar: z.object({
        url: z.string().optional(),
        publicId: z.string().optional(),
    }).optional(),
});

export type TProfileFormValues = z.infer<typeof profileFormSchema>;