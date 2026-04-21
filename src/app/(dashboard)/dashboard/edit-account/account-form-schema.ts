import { z } from "zod";

export const accountFormSchema = z.object({
    name: z.string().min(1, "Name is required"),
    phone: z.string().min(1, "Phone is required"),
    avatar: z.object({
        url: z.string().min(1, "Avatar URL is required"),
        publicId: z.string().min(1, "Avatar public ID is required"),
    }),
});

export type TAccountFormValues = z.infer<typeof accountFormSchema>;