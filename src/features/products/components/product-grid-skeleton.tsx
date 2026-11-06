import { Skeleton } from "@/shared/ui/skeleton";

/**
 * Placeholder cards in the same grid as the real ones, so applying a filter
 * does not collapse the page height and bounce the scroll position.
 */
export default function ProductGridSkeleton({ count = 12 }: { count?: number }) {
    return (
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: count }, (_, index) => (
                <div key={index} className="space-y-2">
                    <Skeleton className="aspect-[3/4] w-full rounded-xl" />
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/2" />
                </div>
            ))}
        </div>
    );
}
