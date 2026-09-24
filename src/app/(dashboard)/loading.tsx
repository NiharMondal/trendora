import { Skeleton } from "@/shared/ui/skeleton";

// Rendered below the persistent sidebar and tab strip in `(dashboard)/layout.tsx`.
export default function DashboardLoading() {
    return (
        <div className="space-y-4 rounded-xl bg-background p-5" aria-busy="true">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-10 w-full" />
            {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
            ))}
        </div>
    );
}
