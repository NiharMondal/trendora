import z from "zod";

export const registerSchema = z.object({
    name: z
        .string({ error: "Full name is required!" })
        .nonempty("Full name is required!")
        .trim(),
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

export type TRegisterSchemaType = z.infer<typeof registerSchema>;

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
export type TLoginSchemaType = z.infer<typeof loginSchema>;

export const changePasswordSchema = z
    .object({
        oldPassword: z
            .string({ error: "Old password is required" })
            .nonempty("Old password is required!")
            .trim(),
        newPassword: z
            .string({ error: "New password is required" })
            .min(6, "Password must be at least 6 characters long")
            .regex(/[A-Za-z]/, "Password must contain at least one letter")
            .regex(/[0-9]/, "Password must contain at least one number")
            .trim(),
        confirmPassword: z
            .string({ error: "Confirm password is required" })
            .min(6, "Password must be at least 6 characters long")
            .regex(/[A-Za-z]/, "Password must contain at least one letter")
            .regex(/[0-9]/, "Password must contain at least one number")
            .trim(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        error: "Passwords do not match",
        path: ["confirmPassword"],
    });

export type TChangePassword = z.infer<typeof changePasswordSchema>;
