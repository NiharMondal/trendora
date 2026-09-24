import z from "zod";

/**
 * SERVER-ONLY secrets, validated at module load (FE-30).
 *
 * Import this only from server code — `auth-options.ts` and `middleware.ts`.
 * In a browser these are always undefined, so importing it from a client
 * component would throw on every page. Public values are in `env-config.ts`.
 */
const present = (message: string) =>
    z.preprocess(
        (value) =>
            typeof value === "string" && value.trim() === "" ? undefined : value,
        z.string({ error: message }).trim().min(1, { error: message }),
    );

const serverEnvSchema = z.object({
    /** Signs the NextAuth session JWT. The same value must reach the middleware. */
    NEXT_AUTH_SECRET: present("is missing"),
    GOOGLE_CLIENT_ID: present("is missing"),
    GOOGLE_CLIENT_SECRET: present("is missing"),
});

const parsed = serverEnvSchema.safeParse({
    NEXT_AUTH_SECRET: process.env.NEXT_AUTH_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
});

if (!parsed.success) {
    const problems = parsed.error.issues
        .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
        .join("\n");
    throw new Error(
        `Invalid server environment configuration — see .env.example:\n${problems}`,
    );
}

export const serverEnv = parsed.data;
