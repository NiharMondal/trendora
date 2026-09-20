import { z } from "zod";

export const checkoutFormSchema = z
    .object({
        shippingAddressId: z
            .string()
            .optional()
            .transform((val) =>
                val === "" || val === undefined ? undefined : val,
            )
            .pipe(z.uuidv4("Please select an address").optional()),
        fullName: z.string().trim().optional(),
		email: z.email("Invalid email").optional(),
        phone: z.string().trim().optional(),
        street: z.string().trim().optional(),
        city: z.string().trim().optional(),
        state: z.string().trim().optional(),
        postalCode: z.string().trim().optional(),
        country: z.string().trim().optional(),
        paymentMethod: z.string().min(1, "Payment method is required"),
        notes: z.string().max(500).optional(),
    })
    .superRefine((data, ctx) => {
        const usingExistingAddress = !!data.shippingAddressId;

        if (!usingExistingAddress) {
            const requiredFields: Array<keyof typeof data> = [
                "fullName",
                "email",
                "phone",
                "street",
                "city",
                "postalCode",
                "country",
            ];

            requiredFields.forEach((field) => {
                if (!data[field] || data[field]?.trim() === "") {
                    ctx.addIssue({
                        path: [field],
                        code: "custom",
                        message: "This field is required",
                    });
                }
            });
        }
    });

export type TCheckoutFormValues = z.infer<typeof checkoutFormSchema>;
