import TdAvatar from "@/components/common/@ui/td-avatar";
import { TReview } from "@/components/types/review.types";
import { formatDate } from "@/lib/format-date-time";
import { ReactSmartRating } from "react-smart-rating";

export default function ReviewItem({ review }: { review: TReview }) {
    const fallback = review?.user?.name?.slice(0, 2).toUpperCase() || "U";

    return (
        <div className="rounded-lg border border-muted bg-card/50 p-5">
            <div className="flex items-start gap-4">
                <TdAvatar
                    src={review.user?.avatar}
                    alt={review.user?.name}
                    size="md"
                    fallback={fallback}
                />
                <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                            <p className="font-medium">
                                {review.user?.name ?? "Anonymous"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {formatDate(review.createdAt, "ll")}
                            </p>
                        </div>
                        <ReactSmartRating
                            initialRating={review.rating}
                            totalStars={5}
                            size={16}
                            readOnly
                        />
                    </div>
                    <p className="text-sm leading-relaxed text-foreground/90">
                        {review.comment}
                    </p>
                </div>
            </div>
        </div>
    );
}
