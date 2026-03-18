import z from "zod";

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
