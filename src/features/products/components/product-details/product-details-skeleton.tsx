import Container from "@/shared/components/container";
import { Skeleton } from "@/shared/ui/skeleton";

/**
 * Placeholder in the exact shape of the product page — breadcrumb, gallery on
 * the left, buy box on the right — so the real content lands where the
 * shopper is already looking instead of replacing a spinner in one jump.
 *
 * Used twice: by the route's `loading.tsx` while navigation is in flight, and
 * by `ProductDetailsView` while `useProductBySlugQuery` loads. One component,
 * so the two cannot drift into a visible swap between them. Keep it in step
 * with `ProductGallery` / `ProductCommonDetails` / `DeliveryDetails`.
 */
export default function ProductDetailsSkeleton() {
    return (
        <Container className="space-y-6 py-6 lg:py-8">
            <div
                role="status"
                aria-busy="true"
                aria-label="Loading product"
                className="animate-in fade-in duration-300 space-y-6 motion-reduce:animate-none"
            >
                <Skeleton className="h-4 w-64" />

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
                    {/* Gallery: thumbnails below on mobile, beside on lg */}
                    <div className="flex flex-col gap-3 lg:flex-row-reverse">
                        <Skeleton className="aspect-[4/5] w-full flex-1 rounded-2xl" />
                        <div className="flex gap-3 lg:flex-col">
                            {Array.from({ length: 4 }, (_, index) => (
                                <Skeleton key={index} className="size-20 shrink-0 rounded-lg" />
                            ))}
                        </div>
                    </div>

                    {/* Buy box */}
                    <div className="space-y-8">
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <Skeleton className="h-3 w-20" />
                                <Skeleton className="h-9 w-4/5" />
                                <Skeleton className="h-5 w-64" />
                            </div>
                            <Skeleton className="h-8 w-36" />
                            <div className="space-y-3">
                                <Skeleton className="h-4 w-28" />
                                <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4">
                                    {Array.from({ length: 4 }, (_, index) => (
                                        <Skeleton key={index} className="h-[74px] w-full rounded-lg" />
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-3">
                                <Skeleton className="h-4 w-16" />
                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-12 w-40 rounded-full" />
                                    <Skeleton className="h-12 flex-1 rounded-full" />
                                    <Skeleton className="size-12 rounded-full" />
                                </div>
                            </div>
                            <div className="space-y-2 border-t pt-6">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-2/3" />
                            </div>
                        </div>
                        <Skeleton className="h-64 w-full rounded-2xl" />
                    </div>
                </div>
                <span className="sr-only">Loading product…</span>
            </div>
        </Container>
    );
}
