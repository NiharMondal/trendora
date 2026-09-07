import z from "zod";


export const loginSchema = z.object({
    email: z
        .email({
            error: "Please provide a valid email address",
        })
        .toLowerCase()
        .trim(),
    password: z
        .string({ error: "Password is required!" })
        .min(6, "Password must be at least 6 characters long")
        .regex(/[A-Za-z]/, "Password must contain at least one letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .trim(),
});
export type TLoginValues = z.infer<typeof loginSchema>;