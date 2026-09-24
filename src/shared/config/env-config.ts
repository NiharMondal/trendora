import z from "zod";

/**
 * PUBLIC config, validated once at module load (FE-30).
 *
 * This module is imported by client code (the cart, RTK Query, uploads), so it
 * holds only `NEXT_PUBLIC_*` values — server secrets live in `server-env.ts`,
 * which never reaches a browser, where they would always be undefined.
 *
 * Every value is read by its LITERAL `process.env.NEXT_PUBLIC_…` name: Next
 * inlines those at build time, and a dynamic `process.env[key]` would be
 * `undefined` in the client bundle.
 *
 * Before this, a deploy that forgot `NEXT_PUBLIC_TAX_RATE` quoted 0% tax in
 * the cart (`Number(undefined) || 0`) while the backend charged its own rate —
 * the buyer billed more than they were shown, with no error anywhere
 * (XR-01). Now a missing or malformed value fails the build and the page load,
 * naming the variable.
 */

/** A blank value is MISSING — `z.coerce.number()` would otherwise read "" as 0. */
const present = <T extends z.ZodType>(schema: T) =>
    z.preprocess(
        (value) =>
            typeof value === "string" && value.trim() === "" ? undefined : value,
        schema,
    );

const publicEnvSchema = z.object({
    NEXT_PUBLIC_BACKEND_URL: present(
        z
            .url({ error: "must be an absolute URL" })
            .refine((url) => /\/api\/v\d+\/?$/.test(url), {
                error: "must include the API base path, e.g. http://localhost:5001/api/v1",
            }),
    ),
    /** Must equal the backend's `TAX_RATE`. A fraction: 0.05 is 5%. */
    NEXT_PUBLIC_TAX_RATE: present(
        z.coerce.number().min(0).max(1, { error: "is a fraction — 0.05 means 5%" }),
    ),
    /**
     * Fallbacks only: shipping is per store and comes from each cart item.
     * Used just for a cart persisted before stores existed. Still required, so
     * a missing value is noticed rather than silently becoming free shipping.
     */
    NEXT_PUBLIC_SHIPPING_COST: present(z.coerce.number().min(0)),
    NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD: present(z.coerce.number().min(0)),
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: present(z.string().trim().min(1)),
    NEXT_PUBLIC_CLOUDINARY_PRESET_NAME: present(z.string().trim().min(1)),
});

const raw: Record<keyof z.input<typeof publicEnvSchema>, string | undefined> = {
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
    NEXT_PUBLIC_TAX_RATE: process.env.NEXT_PUBLIC_TAX_RATE,
    NEXT_PUBLIC_SHIPPING_COST: process.env.NEXT_PUBLIC_SHIPPING_COST,
    NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD: process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD,
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    NEXT_PUBLIC_CLOUDINARY_PRESET_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME,
};

const parsed = publicEnvSchema.safeParse(raw);

if (!parsed.success) {
    // "Missing" is decided from the raw value: Zod v4 does not put the input
    // on an issue by default, and a blank value is treated as absent.
    const problems = parsed.error.issues
        .map((issue) => {
            const key = issue.path.join(".") as keyof typeof raw;
            const missing = !raw[key]?.trim();
            return `  - ${key}: ${missing ? "is missing" : `${issue.message} (got "${raw[key]}")`}`;
        })
        .join("\n");
    throw new Error(
        `Invalid public environment configuration — see .env.example:\n${problems}`,
    );
}

const env = parsed.data;

export const envConfig = {
    /** Includes `/api/v1`. No trailing slash. */
    backend_url: env.NEXT_PUBLIC_BACKEND_URL.replace(/\/$/, ""),
    tax_rate: env.NEXT_PUBLIC_TAX_RATE,
    shipping_cost: env.NEXT_PUBLIC_SHIPPING_COST,
    free_shipping_threshold: env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD,
    cloudinary_cloud_name: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    cloudinary_preset_name: env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME,
} as const;
