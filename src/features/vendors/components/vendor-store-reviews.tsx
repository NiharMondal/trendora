"use client";

import { MessageSquareText, Star } from "lucide-react";
import Link from "next/link";

import {
    useMyStoreQuery,
    useStoreReviewsQuery,
} from "@/features/vendors/api/vendor.api";
import { TVendorReview } from "@/features/vendors/types/vendor.types";
import SpinnerLoading from "@/shared/components/loading/spinner-loading";
import NoDataFound from "@/shared/components/no-data-found";
import QueryError from "@/shared/components/query-error";
import { DataTable } from "@/shared/components/table";
import { DataTableColumn } from "@/shared/components/table/table-types";
import TdAvatar from "@/shared/components/td-avatar";
import { useTableFilters } from "@/shared/hooks/use-table-filters";
import { formatDate } from "@/shared/lib/format-date-time";
import { cn } from "@/shared/lib/utils";
import { getApiErrorMessage, getApiErrorStatus } from "@/shared/utils/api-error";

const Stars = ({ rating }: { rating: number }) => (
    <span className="flex items-center gap-0.5" aria-label={`${rating.toFixed(1)} out of 5`}>
        {[1, 2, 3, 4, 5].map((n) => (
            <Star
                key={n}
                className={cn(
                    "size-4",
                    n <= Math.round(rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted-foreground/40",
                )}
            />
        ))}
    </span>
);

const columns: DataTableColumn<TVendorReview>[] = [
    {
        key: "user",
        header: "Buyer",
        cell: (row) => (
            <div className="flex items-center gap-2">
                <TdAvatar
                    src={row.user?.avatar ?? undefined}
                    alt={row.user?.name}
                    size="sm"
                    fallback={row.user?.name?.charAt(0).toUpperCase() || "B"}
                />
                <span className="font-medium">{row.user?.name ?? "A buyer"}</span>
            </div>
        ),
    },
    {
        key: "rating",
        header: "Rating",
        cell: (row) => <Stars rating={Number(row.rating)} />,
    },
    {
        key: "comment",
        header: "Comment",
        cell: (row) =>
            row.comment ? (
                <p className="max-w-md whitespace-pre-line text-sm">{row.comment}</p>
            ) : (
                <span className="text-sm text-muted-foreground">Rating only</span>
            ),
    },
    {
        key: "createdAt",
        header: "Date",
        cell: (row) => formatDate(row.createdAt, "ll"),
    },
];

/**
 * The seller's own store reviews.
 *
 * Reads the PUBLIC `GET /vendor-reviews/store/:slug` with the store's slug from
 * `/vendors/me`. `/vendor-reviews/my-reviews` looks like the right endpoint and
 * is not: it lists reviews the user WROTE as a buyer (FE-19). Being the public
 * list, it is exactly what shoppers see on the storefront — which is the point.
 */
export default function VendorStoreReviews() {
    const {
        data: storeData,
        isLoading: storeLoading,
        error: storeError,
        refetch: retryStore,
    } = useMyStoreQuery();
    const store = storeData?.result;

    const filters = useTableFilters({ defaultSortBy: "createdAt:desc" });
    const {
        data,
        isFetching,
        error: listError,
        refetch: refetchList,
    } = useStoreReviewsQuery(
        { slug: store?.slug ?? "", query: filters.queryParams as Record<string, string> },
        { skip: !store?.slug },
    );

    if (storeLoading) return <SpinnerLoading />;
    // No store at all is a 404 ("You do not have a vendor account yet") — an
    // ADMIN can reach /vendor/* — and a store that is not usable is an
    // actionable 403. Neither is a failure worth retrying (FE-06).
    const storeStatus = getApiErrorStatus(storeError);
    if (storeStatus === 403 || storeStatus === 404) {
        return (
            <NoDataFound
                title="No active store"
                description={getApiErrorMessage(storeError)}
            />
        );
    }
    if (storeError || !store) {
        return (
            <QueryError
                error={storeError}
                onRetry={retryStore}
                title="Could not load your store"
            />
        );
    }

    const average = store.averageRating ? Number(store.averageRating) : null;

    return (
        <div className="space-y-5">
            <div className="flex flex-col gap-4 rounded-xl bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                    <div className="text-4xl font-bold">
                        {average !== null ? average.toFixed(1) : "–"}
                    </div>
                    <div className="space-y-1">
                        <Stars rating={average ?? 0} />
                        <p className="text-sm text-muted-foreground">
                            {store.totalReviews
                                ? `${store.totalReviews} review${store.totalReviews === 1 ? "" : "s"}`
                                : "No reviews yet"}
                        </p>
                    </div>
                </div>
                <Link
                    href={`/stores/${store.slug}`}
                    className="text-sm text-primary hover:underline"
                >
                    See how buyers see your store →
                </Link>
            </div>

            <DataTable
                title="Store reviews"
                description="Buyers can review your store once a parcel from it is delivered — one review per parcel."
                icon={MessageSquareText}
                columns={columns}
                data={data?.result || []}
                rowKey={(row) => row.id}
                isFetching={isFetching}
                error={listError}
                onRetry={refetchList}
                filters={filters}
                meta={data?.meta}
                // The backend searches the review comment only.
                placeholder="Search review comments..."
                emptyState={{
                    title: "No reviews yet",
                    description:
                        "Reviews appear here after buyers receive their parcels and rate your store.",
                }}
            />
        </div>
    );
}
