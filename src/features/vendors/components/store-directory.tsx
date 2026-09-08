"use client";

import Link from "next/link";
import { Star, Store } from "lucide-react";

import { useAllStoresQuery } from "@/features/vendors/api/vendor.api";
import { TVendorPublic } from "@/features/vendors/types/vendor.types";
import NoDataFound from "@/shared/components/no-data-found";
import SpinnerLoading from "@/shared/components/loading/spinner-loading";
import { useTableFilters } from "@/shared/hooks/use-table-filters";
import { Input } from "@/shared/ui/input";
import { currencyFormatter } from "@/features/cart/utils/calculate-order-total";

/** Browse every approved store on the marketplace. */
export default function StoreDirectory() {
    const filters = useTableFilters({ defaultSortBy: "createdAt:desc" });
    const { data, isLoading } = useAllStoresQuery(
        filters.queryParams as Record<string, string>,
    );

    const stores = data?.result ?? [];

    return (
        <div className="space-y-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2>Stores</h2>
                    <p className="text-sm text-muted-foreground">
                        {data?.meta?.totalData ?? stores.length} sellers on
                        Trendora
                    </p>
                </div>
                <Input
                    placeholder="Search stores..."
                    defaultValue={filters.search}
                    onChange={(event) => filters.setSearch(event.target.value)}
                    className="sm:max-w-xs bg-white"
                />
            </div>

            {isLoading ? (
                <SpinnerLoading />
            ) : stores.length === 0 ? (
                <NoDataFound
                    title="No stores found"
                    description="Try a different search term."
                />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {stores.map((store) => (
                        <StoreCard key={store.id} store={store} />
                    ))}
                </div>
            )}
        </div>
    );
}

function StoreCard({ store }: { store: TVendorPublic }) {
    const threshold = Number(store.freeShippingThreshold ?? 0);

    return (
        <Link
            href={`/stores/${store.slug}`}
            className="bg-white rounded-md overflow-hidden border border-muted hover:border-primary/40 transition-colors"
        >
            <div className="h-24 bg-gray-100">
                {store.banner ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={store.banner}
                        alt={store.storeName}
                        className="size-full object-cover"
                    />
                ) : null}
            </div>

            <div className="p-4 space-y-2">
                <div className="flex items-center gap-3 -mt-8">
                    <div className="size-12 rounded-full bg-white ring-2 ring-white overflow-hidden flex items-center justify-center shadow">
                        {store.logo ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={store.logo}
                                alt={store.storeName}
                                className="size-full object-cover"
                            />
                        ) : (
                            <Store className="size-5 text-muted-foreground" />
                        )}
                    </div>
                </div>

                <p className="font-semibold">{store.storeName}</p>

                {store.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                        {store.description}
                    </p>
                )}

                <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
                    {store.averageRating ? (
                        <span className="flex items-center gap-1">
                            <Star className="size-3 fill-amber-400 text-amber-400" />
                            {Number(store.averageRating).toFixed(1)}
                            <span>({store.totalReviews})</span>
                        </span>
                    ) : (
                        <span>No reviews yet</span>
                    )}

                    {/* Shipping terms are per store, so they belong on the card. */}
                    {threshold > 0 && (
                        <span>
                            Free delivery over {currencyFormatter(threshold)}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}
