"use client";

import { Star, Store, Truck } from "lucide-react";

import { currencyFormatter } from "@/features/cart/utils/calculate-order-total";
import {
    useStoreBySlugQuery,
    useStoreReviewsQuery,
} from "@/features/vendors/api/vendor.api";
import { useStoreProductsQuery } from "@/features/products/api/product.api";
import ProductCard from "@/features/products/components/product-card/product-card";
import NoDataFound from "@/shared/components/no-data-found";
import SpinnerLoading from "@/shared/components/loading/spinner-loading";
import { formatDate } from "@/shared/lib/format-date-time";
import { useTableFilters } from "@/shared/hooks/use-table-filters";
import { Pagination } from "@/shared/components/table";

/**
 * A single storefront: who the seller is, what they charge for delivery, what
 * they sell, and what buyers said about them.
 */
export default function StoreFront({ slug }: { slug: string }) {
    const filters = useTableFilters({ defaultSortBy: "createdAt:desc" });

    const { data: storeData, isLoading: storeLoading } =
        useStoreBySlugQuery(slug);
    const { data: productData, isFetching } = useStoreProductsQuery({
        slug,
        query: filters.queryParams as Record<string, string>,
    });
    const { data: reviewData } = useStoreReviewsQuery({ slug });

    if (storeLoading) return <SpinnerLoading />;

    const store = storeData?.result;
    if (!store)
        return (
            <NoDataFound
                title="Store not found"
                description="This store may have been removed or is no longer accepting orders."
            />
        );

    const products = productData?.result ?? [];
    const reviews = reviewData?.result ?? [];
    const threshold = Number(store.freeShippingThreshold ?? 0);
    const shippingFee = Number(store.shippingFee ?? 0);

    return (
        <div className="space-y-8">
            {/* Banner + identity */}
            <div className="bg-white rounded-md overflow-hidden">
                <div className="h-40 bg-gray-100">
                    {store.banner ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={store.banner}
                            alt={store.storeName}
                            className="size-full object-cover"
                        />
                    ) : null}
                </div>

                <div className="p-5 flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
                    <div className="size-20 rounded-full bg-white ring-4 ring-white overflow-hidden flex items-center justify-center shadow">
                        {store.logo ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={store.logo}
                                alt={store.storeName}
                                className="size-full object-cover"
                            />
                        ) : (
                            <Store className="size-8 text-muted-foreground" />
                        )}
                    </div>

                    <div className="flex-1 space-y-1">
                        <h2>{store.storeName}</h2>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            {store.averageRating ? (
                                <span className="flex items-center gap-1">
                                    <Star className="size-3.5 fill-amber-400 text-amber-400" />
                                    {Number(store.averageRating).toFixed(1)} (
                                    {store.totalReviews} reviews)
                                </span>
                            ) : (
                                <span>No reviews yet</span>
                            )}
                            <span>{store.totalProducts ?? 0} products</span>
                            <span>
                                Selling since {formatDate(store.createdAt, "MMM YYYY")}
                            </span>
                        </div>
                    </div>
                </div>

                {store.description && (
                    <p className="px-5 pb-5 text-sm text-muted-foreground max-w-3xl">
                        {store.description}
                    </p>
                )}

                {/* This store's own delivery terms — they are what checkout
                    charges for this store's items. */}
                <div className="px-5 pb-5">
                    <div className="inline-flex items-center gap-2 text-xs bg-gray-50 border border-muted rounded-md px-3 py-2">
                        <Truck className="size-3.5" />
                        {threshold > 0 ? (
                            <span>
                                {currencyFormatter(shippingFee)} delivery —
                                free over {currencyFormatter(threshold)} from
                                this store
                            </span>
                        ) : (
                            <span>
                                {currencyFormatter(shippingFee)} delivery
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Catalogue */}
            <div className="space-y-5">
                <h3>Products</h3>
                {isFetching && products.length === 0 ? (
                    <SpinnerLoading />
                ) : products.length === 0 ? (
                    <NoDataFound
                        title="No products yet"
                        description="This store has not listed anything for sale."
                    />
                ) : (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                            {products.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />
                            ))}
                        </div>
                        {productData?.meta &&
                            productData.meta.totalPages > 1 && (
                                <Pagination
                                    currentPage={productData.meta.currentPage}
                                    totalPages={productData.meta.totalPages}
                                    hasNextPage={productData.meta.hasNextPage}
                                    hasPreviousPage={
                                        productData.meta.hasPreviousPage
                                    }
                                    onPageChange={filters.setCurrentPage}
                                    limit={Number(filters.limit)}
                                    totalData={productData.meta.totalData}
                                />
                            )}
                    </>
                )}
            </div>

            {/* Store reviews — these rate the SELLER, not a product. */}
            <div className="space-y-4">
                <h3>What buyers say about this store</h3>
                {reviews.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        No store reviews yet. Buyers can rate a store once their
                        order has been delivered.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {reviews.map((review) => (
                            <div
                                key={review.id}
                                className="bg-white rounded-md p-4 space-y-2"
                            >
                                <div className="flex items-center justify-between">
                                    <p className="font-medium text-sm">
                                        {review.user?.name ?? "A buyer"}
                                    </p>
                                    <span className="flex items-center gap-1 text-xs">
                                        <Star className="size-3 fill-amber-400 text-amber-400" />
                                        {Number(review.rating).toFixed(1)}
                                    </span>
                                </div>
                                {review.comment && (
                                    <p className="text-sm text-muted-foreground">
                                        {review.comment}
                                    </p>
                                )}
                                <p className="text-xs text-muted-foreground">
                                    {formatDate(review.createdAt, "ll")}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
