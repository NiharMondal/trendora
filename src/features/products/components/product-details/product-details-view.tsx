"use client";

import { useEffect } from "react";

import { useProductBySlugQuery } from "@/features/products/api/product.api";
import ProductDetails from "@/features/products/components/product-details/product-details";
import ProductDetailsSkeleton from "@/features/products/components/product-details/product-details-skeleton";
import ProductGallery from "@/features/products/components/product-details/product-gallery";
import RecentlyViewed from "@/features/products/components/product-details/recently-viewed";
import RelatedProducts from "@/features/products/components/product-details/related-products";
import { useRecentlyViewed } from "@/features/products/hooks/use-recently-viewed";
import ReviewSection from "@/features/reviews/components/review-section/review-section";
import Container from "@/shared/components/container";
import QueryError from "@/shared/components/query-error";
import PageBreadcrumb from "@/shared/components/page-breadcrumb";

/** The product page body; `app/(root)/products/[slug]/page.tsx` is its shell. */
export default function ProductDetailsView({ slug }: { slug: string }) {
    const { data, isLoading, error, refetch } = useProductBySlugQuery(slug);
    const product = data?.result;
    const { recordView } = useRecentlyViewed();

    // Recorded only once the listing has loaded, so a 404 or a typo'd slug
    // never enters the trail.
    const productId = product?.id;
    useEffect(() => {
        if (productId) recordView(productId);
    }, [productId, recordView]);

    if (isLoading) return <ProductDetailsSkeleton />;
    if (error || !product) {
        return (
            <Container className="py-10">
                <QueryError
                    error={error}
                    onRetry={refetch}
                    title="Could not load this product"
                    notFound={{
                        title: "Product not found",
                        description:
                            "This listing may have been removed or is no longer on sale.",
                    }}
                />
            </Container>
        );
    }

    return (
        <Container className="space-y-12 py-6 lg:py-8">
            <div className="space-y-6">
                <PageBreadcrumb
                    items={[
                        { label: "Products", href: "/products" },
                        product.category && {
                            label: product.category.name,
                            href: `/products?categoryId=${product.category.id}`,
                        },
                        { label: product.name },
                    ]}
                />

                <section className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
                    <ProductGallery
                        images={product.images}
                        productName={product.name}
                    />
                    {/* Sticky, so the buy box stays in view beside a tall gallery. */}
                    <div className="lg:sticky lg:top-6 lg:self-start">
                        <ProductDetails product={product} />
                    </div>
                </section>
            </div>

            {/* Anchor for the "N reviews" link beside the rating. */}
            <div id="reviews" className="scroll-mt-6 border-t pt-8">
                <ReviewSection
                    productId={product.id}
                    averageRating={product.averageRating ?? 0}
                />
            </div>

            <RelatedProducts productId={product.id} />

            {/* the shopper's own trail, minus this product */}
            <RecentlyViewed productId={product.id} />
        </Container>
    );
}
