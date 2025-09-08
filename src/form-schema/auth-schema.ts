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
