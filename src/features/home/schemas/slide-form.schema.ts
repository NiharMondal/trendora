import z from "zod";

// Mirrors `slideSchema` in the backend's `slide.validation.ts`.
export const slideFormSchema = z.object({
    title: z
        .string({ error: "Title is required" })
        .trim()
        .min(5, "Title should contain at least 5 characters")
        .max(30, "Title should contain at most 30 characters"),
    subtitle: z
        .string({ error: "Subtitle is required" })
        .trim()
        .min(20, "Subtitle should contain at least 20 characters")
        .max(120, "Subtitle should contain at most 120 characters"),
    /**
     * `{ url, publicId }` — the Cloudinary temp-folder handshake. The backend
     * promotes the upload out of `temp/` on save, so a live banner is never
     * left deletable through `/cloudinary/delete-temp` (BE-41). An image
     * hosted elsewhere keeps an empty `publicId`.
     */
    photo: z.object({
        url: z.string().trim().min(1, "A slide image is required"),
        publicId: z.string().trim(),
    }),
    url: z
        .string({ error: "Link is required" })
        .trim()
        .min(1, "Link is required")
        .refine((value) => value.startsWith("/") || /^https?:\/\//.test(value), {
            error: "Use a path starting with / or a full http(s) URL",
        }),
    sortOrder: z
        .number({ error: "Sort order is required" })
        .int("Sort order must be a whole number")
        .min(0, "Sort order cannot be negative"),
    isActive: z.boolean(),
});

export type TSlideFormValues = z.infer<typeof slideFormSchema>;
