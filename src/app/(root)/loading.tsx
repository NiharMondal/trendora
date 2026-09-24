import Container from "@/shared/components/container";
import { Skeleton } from "@/shared/ui/skeleton";

// Shown inside the storefront layout (navbar and footer stay put) while a
// route's server payload is in flight — instant feedback on navigation.
export default function StorefrontLoading() {
    return (
        <div aria-busy="true">
        <Container className="space-y-6 py-6">
            <Skeleton className="h-8 w-56" />
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="space-y-3">
                        <Skeleton className="aspect-square w-full rounded-xl" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/3" />
                    </div>
                ))}
            </div>
        </Container>
        </div>
    );
}
