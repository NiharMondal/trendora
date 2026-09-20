import { z } from "zod";

export const addressSchema = z.object({
    fullName: z.string().min(1, "Name is required").trim(),
    email: z.email("Invalid email address").trim(),
    phone: z.string().min(1, "Phone number is required").trim(),
    street: z.string().min(1, "Address is required").trim(),
    city: z.string().min(1, "City is required").trim(),
    state: z.string().optional(),
    postalCode: z.string().min(1, "Postal code is required").trim(),
    country: z.string().min(1, "Country is required").trim(),
    isDefault: z.boolean().optional(),
});

export type TAddressFormValues = z.infer<typeof addressSchema>;
