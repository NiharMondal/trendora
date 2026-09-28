"use client";

import { ExternalLink, Pencil } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { productStatusMap } from "@/features/orders/constants/status-maps";
import { useMyVendorProductByIdQuery } from "@/features/products/api/product.api";
import ProductDetails from "@/features/products/components/product-details/product-details";
import ProductDetailsSkeleton from "@/features/products/components/product-details/product-details-skeleton";
import ProductGallery from "@/features/products/components/product-details/product-gallery";
import { TProduct } from "@/features/products/types/product.types";
import ReviewSection from "@/features/reviews/components/review-section/review-section";
import Headline from "@/shared/components/headline";
import QueryError from "@/shared/components/query-error";
import TDStatusBadge from "@/shared/components/td-status-badge";
import { Button } from "@/shared/ui/button";
import { StatusBadge } from "@/shared/ui/status-badge";

/**
 * Admin view of one listing, laid out exactly like the storefront product page
 * (`product-details-view.tsx`) — same gallery, same buy box, same reviews — so
 * what an admin approves is what a shopper will see. Two differences:
 *
 * - it reads the owner/admin endpoint, because the public one 404s on the
 *   drafts and pending listings this page exists to inspect;
 * - the buy box and reviews are read-only (`preview` / `readOnly`), and a
 *   strip of moderation facts sits on top.
 *
 * Related products and "recently viewed" are left out: they are shopping aids,
 * and recording a view here would pollute the admin's own storefront trail.
 */
export default function AdminProductDetailsView({ id }: { id: string }) {
    const { data, isLoading, error, refetch } = useMyVendorProductByIdQuery(id);
    const product = data?.result;

    if (isLoading) return <ProductDetailsSkeleton />;
    if (error || !product) {
        return (
            <QueryError
                error={error}
                onRetry={refetch}
                title="Could not load this product"
                notFound={{
                    title: "Product not found",
                    description:
                        "It may have been deleted, or the link is wrong.",
                }}
            />
        );
    }

    // Mirrors the storefront gate as far as this payload can tell; a
    // suspended store also hides it, which the link would then 404 on.
    const isLive = product.status === "APPROVED" && product.isPublished;

    return (
        <div className="space-y-6">
            <Headline
                title="Product Details"
                showBackButton
                titleExtra={
                    <StatusBadge
                        statusMap={productStatusMap}
                        status={product.status}
                    />
                }
            >
                <div className="flex flex-wrap items-center gap-2">
                    {isLive && (
                        <Button asChild variant="outline" size="sm">
                            <Link
                                href={`/products/${product.slug}`}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <ExternalLink />
                                View on store
                            </Link>
                        </Button>
                    )}
                    <Button asChild size="sm">
                        <Link
                            href={`/admin/product-list/update-product/${product.id}`}
                        >
                            <Pencil />
                            Edit
                        </Link>
                    </Button>
                </div>
            </Headline>

            <ListingFacts product={product} />

            <div className="bg-white padding border-radius space-y-12">
                <section className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
                    <ProductGallery
                        images={product.images}
                        productName={product.name}
                    />
                    <div className="lg:sticky lg:top-6 lg:self-start">
                        <ProductDetails product={product} preview />
                    </div>
                </section>

                <div className="border-t pt-8">
                    <ReviewSection
                        productId={product.id}
                        averageRating={product.averageRating ?? 0}
                        readOnly
                    />
                </div>
            </div>
        </div>
    );
}

/** The moderation facts a shopper never sees. */
function ListingFacts({ product }: { product: TProduct }) {
    return (
        <div className="bg-white padding border-radius space-y-3">
            <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                <Fact label="Store">
                    {product.vendor ? (
                        <Link
                            href={`/stores/${product.vendor.slug}`}
                            className="hover:underline"
                        >
                            {product.vendor.storeName}
                        </Link>
                    ) : (
                        "—"
                    )}
                </Fact>
                <Fact label="Category">{product.category?.name ?? "—"}</Fact>
                <Fact label="Visibility">
                    <TDStatusBadge
                        status={product.isPublished ? "PUBLISHED" : "UNPUBLISHED"}
                        value={product.isPublished ? "Published" : "Hidden by store"}
                    />
                </Fact>
                <Fact label="Home page">
                    <TDStatusBadge
                        status={product.isFeatured ? "FEATURED" : "INACTIVE"}
                        value={product.isFeatured ? "Featured" : "Not featured"}
                    />
                </Fact>
                <Fact label="Stock">{product.stockQuantity}</Fact>
            </dl>

            {product.status === "REJECTED" && product.rejectionReason && (
                <p className="rounded-md border border-status-danger-border bg-status-danger px-3 py-2 text-sm text-status-danger-foreground">
                    Rejected: {product.rejectionReason}
                </p>
            )}
        </div>
    );
}

function Fact({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div className="space-y-1">
            <dt className="text-xs text-muted-foreground">{label}</dt>
            <dd className="text-sm font-medium">{children}</dd>
        </div>
    );
}
