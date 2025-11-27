import z from "zod";

export const register = z.object({
	name: z.string({ error: "Name is required" }),
	email: z.string({ error: "Email is required" }),
	password: z.string({ error: "Password is required" }),
});

export const login = z.object({
	email: z.string({ error: "Email is required" }),
	password: z.string({ error: "Password is required" }),
});

export const changePasswordSchema = z
	.object({
		oldPassword: z
			.string({ error: "Old password is required" })
			.nonempty("Can not be empty"),
		newPassword: z
			.string({ error: "New password is required" })
			.nonempty("Can not be empty")
			.trim(),
		confirmPassword: z
			.string({ error: "Confirm password is required" })
			.nonempty("Can not be empty")
			.trim(),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		error: "Passwords do not match",
		path: ["confirmPassword"],
	});

export type TChangePassword = z.infer<typeof changePasswordSchema>;
