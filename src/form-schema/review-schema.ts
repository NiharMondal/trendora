import z from "zod";

export const reviewSchema = z.object({
    user: z.string().optional(),
    rating: z.coerce
        .number({
            error: "Rating is required",
        })
        .min(1, "Rating must be at least 1")
        .max(5, "Rating cannot be more than 5"),
    comment: z
        .string({
            error: "Comment is required",
        })
        .min(10, "Comment must be at least 10 characters")
        .max(500, "Comment cannot be more than 500 characters"),
});

export type TReviewFormData = z.infer<typeof reviewSchema>;
