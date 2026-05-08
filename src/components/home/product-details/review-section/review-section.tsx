"use client";

import SectionHeader from "@/components/common/shared/section-header";
import ReviewItem from "@/components/home/product-details/review-section/review-item";
import ReviewListSkeleton from "@/components/home/product-details/review-section/review-list-skeleton";
import ReviewSummary from "@/components/home/product-details/review-section/review-summary";
import WriteReview from "@/components/home/product-details/review-section/write-review";
import { useReviewsByProductIdQuery } from "@/redux/api/reviewApi";
import { useUserInfoClient } from "@/utils/user-info";
import Link from "next/link";

type Props = {
    productId: string;
    averageRating?: number;
};

export default function ReviewSection({
    productId,
    averageRating = 0,
}: Props) {
    const user = useUserInfoClient();

    const { data: productReviews, isLoading } = useReviewsByProductIdQuery(
        productId,
        {
            skip: !productId,
        },
    );


    const reviews = productReviews?.result ?? [];
    const total = reviews.length;

    const distribution = [5, 4, 3, 2, 1].map((star) => ({
        star,
        count: reviews.filter((r) => Math.ceil(r.rating) === star).length,
    }));

    return (
        <section className="space-y-8 py-8">
            <SectionHeader title="Customer Reviews" />

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <ReviewSummary
                    average={averageRating}
                    total={total}
                    distribution={distribution}
                />

                <div className="lg:col-span-2">
                    {user ? (
                        <WriteReview productId={productId} />
                    ) : (
                        <Link href="/login">
                            <div className="rounded-lg border border-muted bg-card/50 p-6 text-center text-sm text-muted-foreground">
                                Please log in to write a review.
                            </div>
                        </Link>
                    )}
                </div>
            </div>

            <div className="space-y-4">
                {isLoading ? (
                    <ReviewListSkeleton />
                ) : reviews.length === 0 ? (
                    <div className="rounded-lg border border-muted bg-card/50 p-10 text-center">
                        <p className="text-base font-medium">No reviews yet</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Be the first to share your thoughts on this product.
                        </p>
                    </div>
                ) : (
                    reviews.map((review) => (
                        <ReviewItem key={review.id} review={review} />
                    ))
                )}
            </div>
        </section>
    );
}
