"use client";

import { BadgeCheck, Star } from "lucide-react";
import { useState } from "react";

import TdAvatar from "@/shared/components/td-avatar";
import { TReview } from "@/features/reviews/types/review.types";
import { dateFromNow, formatDate } from "@/shared/lib/format-date-time";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

/** Comments longer than this start collapsed behind "Read more". */
const CLAMP_AT = 280;

/**
 * One product review. Every review is from a verified buyer — the backend only
 * accepts one against a delivered purchase (`getEligibility`) — so the badge
 * states a fact rather than decorating.
 */
export default function ReviewItem({ review }: { review: TReview }) {
    const [expanded, setExpanded] = useState(false);

    const name = review.user?.name || "Anonymous";
    const initials = name
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part.charAt(0))
        .join("")
        .toUpperCase();
    const rating = Math.round(Number(review.rating) || 0);
    const comment = review.comment?.trim() ?? "";
    const isLong = comment.length > CLAMP_AT;
    // A minute of slack: create writes both timestamps a few ms apart.
    const wasEdited =
        new Date(review.updatedAt).getTime() -
            new Date(review.createdAt).getTime() >
        60_000;

    return (
        <article className="rounded-xl border border-muted bg-card p-5 transition-shadow hover:shadow-sm">
            <header className="flex items-start gap-3">
                <TdAvatar
                    src={review.user?.avatar || undefined}
                    alt={name}
                    size="sm"
                    fallback={initials || "U"}
                    className="flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-50 text-xs font-semibold text-primary-700 ring-1 ring-primary/20"
                />

                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <p className="truncate font-medium">{name}</p>
                        <span className="inline-flex items-center gap-1 rounded-full bg-status-success px-2 py-0.5 text-[11px] font-medium text-status-success-foreground">
                            <BadgeCheck className="size-3" aria-hidden="true" />
                            Verified buyer
                        </span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                        <time
                            dateTime={review.createdAt}
                            title={formatDate(review.createdAt, "ll")}
                        >
                            {dateFromNow(review.createdAt)}
                        </time>
                        {wasEdited && <span> · Edited</span>}
                    </p>
                </div>

                <Stars rating={rating} />
            </header>

            {comment && (
                <div className="mt-4 pl-11">
                    <p
                        className={cn(
                            "whitespace-pre-line text-sm leading-relaxed text-foreground/85",
                            isLong && !expanded && "line-clamp-4",
                        )}
                    >
                        {comment}
                    </p>
                    {isLong && (
                        <Button
                            type="button"
                            variant="link"
                            size="sm"
                            onClick={() => setExpanded((open) => !open)}
                            aria-expanded={expanded}
                            className="mt-1 h-auto p-0 text-xs"
                        >
                            {expanded ? "Show less" : "Read more"}
                        </Button>
                    )}
                </div>
            )}
        </article>
    );
}

/** Same star as `ReviewSummary`, so the list and the summary match. */
function Stars({ rating }: { rating: number }) {
    return (
        <div
            role="img"
            aria-label={`Rated ${rating} out of 5`}
            className="flex shrink-0 items-center gap-1.5"
        >
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        aria-hidden="true"
                        className={cn(
                            "size-4",
                            star <= rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-muted text-muted",
                        )}
                    />
                ))}
            </div>
            <span className="text-sm font-semibold">{rating}.0</span>
        </div>
    );
}
