import { z } from "zod";

export const reviewSchema = z.object({
    rating: z.number().min(1, "Rating is required"),
    productId: z.string().min(1, "Product ID is required").optional(),
    user: z.string().optional(),
    comment: z.string().trim().optional(),
});

export type TReviewFormValues = z.infer<typeof reviewSchema>;
