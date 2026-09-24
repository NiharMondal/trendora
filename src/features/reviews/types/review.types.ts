import { TProduct } from "@/features/products/types/product.types";
import { TUser } from "@/features/users/types/user.types";

export type TReview = {
    id: string;
    rating: number;
    comment: string;
    userId: string;
    productId: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    user: Pick<TUser, "name" | "avatar">;
    product?: Pick<TProduct, "id" | "name" | "slug" | "images">;
};

/**
 * `GET /reviews/eligibility/:productId`. A product review needs a DELIVERED
 * parcel containing the product, and there is one per buyer per product.
 */
export type TReviewEligibility = {
    canReview: boolean;
    reason: "ALREADY_REVIEWED" | "NOT_DELIVERED" | "NOT_PURCHASED" | null;
    /** The caller's existing review, when `reason` is ALREADY_REVIEWED. */
    reviewId?: string;
};
