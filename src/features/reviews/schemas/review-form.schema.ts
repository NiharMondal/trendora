import { z } from "zod";

export const reviewSchema = z.object({
    rating: z.number().min(1, "Rating is required"),
    productId: z.string().min(1, "Product ID is required").optional(),
    user: z.string().optional(),
    // Empty means "rating only" — WriteReview drops it before sending. When
    // present it follows the backend's rule: 2–400 characters.
    comment: z
        .string()
        .trim()
        .max(400, "A comment should be at most 400 characters")
        .refine((value) => value.length === 0 || value.length >= 2, {
            error: "A comment should be at least 2 characters",
        })
        .optional(),
});

export type TReviewFormValues = z.infer<typeof reviewSchema>;
