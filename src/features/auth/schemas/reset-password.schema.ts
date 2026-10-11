import z from "zod";

// Mirrors the backend's shared `passwordRule` (auth.validation.ts). The
// confirm field is validated here only — the backend receives `newPassword`.
export const resetPasswordSchema = z
    .object({
        newPassword: z
            .string({ error: "Password is required!" })
            .min(6, "Password must be at least 6 characters long")
            .max(30, "Password must not exceed 30 characters")
            .regex(/[A-Za-z]/, "Password must contain at least one letter")
            .regex(/[0-9]/, "Password must contain at least one number")
            .trim(),
        confirmPassword: z
            .string({ error: "Please confirm your password" })
            .nonempty("Please confirm your password"),
    })
    .refine((values) => values.newPassword === values.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export type TResetPasswordValues = z.infer<typeof resetPasswordSchema>;
