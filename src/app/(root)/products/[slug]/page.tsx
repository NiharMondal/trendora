"use client";
import Image from "next/image";
import { use, useEffect, useState } from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";

import ProductDetailsSkeleton from "@/features/products/components/product-details/product-details-skeleton";
import Container from "@/shared/components/container";
import QueryError from "@/shared/components/query-error";
import ProductDetails from "@/features/products/components/product-details/product-details";
import RelatedProducts from "@/features/products/components/product-details/related-products";
import RecentlyViewed from "@/features/products/components/product-details/recently-viewed";
import { useRecentlyViewed } from "@/features/products/hooks/use-recently-viewed";
import ReviewSection from "@/features/reviews/components/review-section/review-section";
import { TProductImage } from "@/features/products/types/product.types";
import { cn } from "@/shared/lib/utils";
import { useProductBySlugQuery } from "@/features/products/api/product.api";

export default function ProductDetailsPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = use(params);
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
        <Container className="py-10 space-y-5">
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Photo section  */}
                <ProductPhotoView images={product?.images} productName={product.name} />
                {/* details section  */}
                <ProductDetails product={product} />
            </section>

            {/* review section */}
            <ReviewSection
                productId={product?.id ?? ""}
                averageRating={product?.averageRating ?? 0}
            />

            {/* related products  */}
            <RelatedProducts productId={product?.id ?? ""} />

            {/* the shopper's own trail, minus this product */}
            <RecentlyViewed productId={product.id} />
        </Container>
    );
}

const ProductPhotoView = ({
    images,
    productName,
}: {
    images: TProductImage[] | undefined;
    productName: string;
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    return (
        <div className="space-y-3">
            <PhotoProvider
                onIndexChange={(newIndex) => setCurrentIndex(newIndex)}
            >
                {/* ⭐ MAIN IMAGE — click to open fullscreen viewer */}
                {images?.map((item, index) => (
                    <PhotoView src={item.url} key={item.id}>
                        {index < 1 ? (
                            <img
                                height={200}
                                width={200}
                                src={images[currentIndex]?.url}
                                // Was the product's ID. The no-op onClick that sat here
                                // (setCurrentIndex(currentIndex)) is gone: PhotoView
                                // already opens the viewer on click.
                                alt={productName}
                                className="w-full h-[600px] object-cover rounded cursor-crosshair"
                                loading="lazy"
                            />
                        ) : undefined}
                    </PhotoView>
                ))}
            </PhotoProvider>
            {/* ⭐ THUMBNAILS */}
            <div className="grid grid-cols-4 gap-4">
                {images?.map((img, index) => (
                    // A button, not a clickable <Image>: keyboard users could
                    // not switch photos before.
                    <button
                        key={img.id}
                        type="button"
                        onClick={() => setCurrentIndex(index)}
                        aria-label={`Show photo ${index + 1} of ${images.length}`}
                        aria-pressed={index === currentIndex}
                        className={cn("rounded focus-visible:outline-2 focus-visible:outline-primary", {
                            "ring-2 ring-blue-500": index === currentIndex,
                        })}
                    >
                        <Image
                            height={80}
                            width={100}
                            src={img.url}
                            alt=""
                            className="h-20 w-full object-cover rounded"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
};
