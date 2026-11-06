"use client";

import SectionHeader from "@/shared/components/section-header";
import ReviewItem from "@/features/reviews/components/review-section/review-item";
import ReviewListSkeleton from "@/features/reviews/components/review-section/review-list-skeleton";
import ReviewSummary from "@/features/reviews/components/review-section/review-summary";
import WriteReview from "@/features/reviews/components/review-section/write-review";
import {
    useReviewEligibilityQuery,
    useReviewsByProductIdQuery,
} from "@/features/reviews/api/review.api";
import { TReviewEligibility } from "@/features/reviews/types/review.types";
import { Skeleton } from "@/shared/ui/skeleton";
import { useUserInfoClient } from "@/features/auth/utils/user-info";
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
    const { data: eligibilityData, isLoading: eligibilityLoading } =
        useReviewEligibilityQuery(productId, { skip: !user || !productId });
    const eligibility = eligibilityData?.result;

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
        <section className="space-y-4 py-4">
            <SectionHeader title="Customer Reviews" />

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <ReviewSummary
                    average={averageRating}
                    total={total}
                    distribution={distribution}
                />

                <div className="lg:col-span-2">
                    {user ? (
                        eligibilityLoading ? (
                            <Skeleton className="h-full min-h-40 w-full rounded-lg" />
                        ) : eligibility?.canReview ? (
                            <WriteReview productId={productId} />
                        ) : (
                            <ReviewGate reason={eligibility?.reason ?? null} />
                        )
                    ) : (
                        <Link href="/login">
                            <div className="rounded-lg border border-muted bg-card/50 p-6 text-center text-sm text-muted-foreground">
                                Please log in to write a review.
                            </div>
                        </Link>
                    )}
                </div>
            </div>

            <div className="space-y-2">
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

/**
 * Why a signed-in shopper sees no review form. Product reviews need a
 * delivered parcel containing the product, one review per buyer (FE-21); the
 * backend enforces it on create, this only explains it.
 */
const GATE_COPY: Record<
    Exclude<TReviewEligibility["reason"], null>,
    { title: string; body: string; link?: { href: string; label: string } }
> = {
    ALREADY_REVIEWED: {
        title: "You have reviewed this product",
        body: "Thanks for sharing. You can change or remove your review at any time.",
        link: { href: "/dashboard/my-reviews", label: "Edit it in My Reviews" },
    },
    NOT_DELIVERED: {
        title: "Your order is on its way",
        body: "You can review this product once it has been delivered.",
        link: { href: "/dashboard/my-orders", label: "Track it in My Orders" },
    },
    NOT_PURCHASED: {
        title: "Reviews are from verified buyers",
        body: "Only shoppers who have received this product can review it.",
    },
};

const ReviewGate = ({ reason }: { reason: TReviewEligibility["reason"] }) => {
    // No reason means the eligibility request failed. Reviewing is optional,
    // so stay quiet rather than put an error box on the product page — the
    // backend still refuses an ineligible review.
    if (!reason) return null;
    const copy = GATE_COPY[reason];
    return (
        <div className="flex h-full flex-col justify-center gap-2 rounded-lg border border-muted bg-card/50 p-6 text-center">
            <p className="font-medium">{copy.title}</p>
            <p className="text-sm text-muted-foreground">{copy.body}</p>
            {copy.link ? (
                <Link href={copy.link.href} className="text-sm text-primary hover:underline">
                    {copy.link.label}
                </Link>
            ) : null}
        </div>
    );
};
