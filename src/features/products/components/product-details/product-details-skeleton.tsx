import Container from "@/shared/components/container";
import { Skeleton } from "@/shared/ui/skeleton";

/**
 * Placeholder in the exact shape of the product page — gallery on the left,
 * details on the right — so the real content lands where the shopper is
 * already looking instead of replacing a spinner in one jump.
 *
 * Used twice: by the route's `loading.tsx` while navigation is in flight, and
 * by the page while `useProductBySlugQuery` loads. One component, so the two
 * cannot drift into a visible swap between them.
 */
export default function ProductDetailsSkeleton() {
    return (
        <Container className="py-10 space-y-5">
            <div
                role="status"
                aria-busy="true"
                aria-label="Loading product"
                className="animate-in fade-in duration-300 grid grid-cols-1 gap-8 lg:grid-cols-2 motion-reduce:animate-none"
            >
                {/* Gallery */}
                <div className="space-y-3">
                    <Skeleton className="h-[420px] w-full rounded-xl lg:h-[600px]" />
                    <div className="grid grid-cols-4 gap-4">
                        {Array.from({ length: 4 }, (_, index) => (
                            <Skeleton key={index} className="h-20 w-full rounded" />
                        ))}
                    </div>
                </div>

                {/* Details */}
                <div className="space-y-5 pr-4">
                    <div className="space-y-3">
                        <Skeleton className="h-8 w-4/5" />
                        <Skeleton className="h-5 w-32" />
                    </div>
                    <Skeleton className="h-7 w-28" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-36" />
                        <Skeleton className="h-4 w-44" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                    </div>

                    <hr className="border-t border-muted my-5" />

                    <div className="space-y-3">
                        <Skeleton className="h-4 w-20" />
                        <div className="grid grid-cols-3 gap-3 xl:grid-cols-4">
                            {Array.from({ length: 4 }, (_, index) => (
                                <Skeleton key={index} className="h-[76px] w-full rounded-md" />
                            ))}
                        </div>
                    </div>

                    <hr className="border-t border-muted my-5" />

                    <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-10 w-32 rounded-md" />
                    </div>

                    <div className="flex items-center gap-x-5">
                        <Skeleton className="h-9 flex-1 rounded-md" />
                        <Skeleton className="size-9 rounded-md" />
                    </div>

                    <Skeleton className="h-32 w-full rounded-lg" />
                </div>
                <span className="sr-only">Loading product…</span>
            </div>
        </Container>
    );
}
