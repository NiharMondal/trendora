import { z } from "zod";

export const reviewSchema = z.object({
    user: z.string().optional(),
    rating: z.number().min(1, "Rating is required"),
    comment: z.string().min(1, "Comment is required"),
});

export type TReviewFormValues = z.infer<typeof reviewSchema>;